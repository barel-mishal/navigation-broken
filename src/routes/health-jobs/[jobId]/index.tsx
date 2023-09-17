import { $, Fragment, type QRL, component$, createContextId, useComputed$, useContext, useContextProvider, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, routeAction$, routeLoader$, useNavigate, z, zod$ } from '@builder.io/qwik-city';
import { Surreal } from 'surrealdb.js';
import { schemaMySession } from '~/utiles/schemaMySession';
export interface Job {
  title: string;
  description: string;
  id: string;
  published: boolean;
  created_at: Date | string;
}

export interface JobDb extends Job {
  [key: string]: any;
}

export const useJobLoader = routeLoader$(async ({ env, params, sharedMap }) => {
  try {
    const route = env.get('ROUTE');
    const dbPass = env.get('DATABASE_PASSWORD');
    const dbUser = env.get('USER_DATABASE');
    const dbName = env.get('DATABASE');
    const dbNamespace = env.get('NAMESPACE');
    if (!route || !dbPass || !dbUser || !dbName || !dbNamespace) {
      throw new Error('Missing environment variables');
    }

    const db = new Surreal();
    await db.connect(route, {
      auth: { pass: dbPass, user: dbUser },
      db: dbName,
      ns: dbNamespace,
    })
    const jobs = await db.select<JobDb>(params.jobId);
    if (!jobs || jobs.length === 0) {
      throw new Error('Job not found');
    }
    const [job] = jobs;

    const session = schemaMySession.safeParse(sharedMap.get('session'));
    if (session.success === false) {
      return { job, isJobOfUser: false };
    }
    if (!session.data.database || !session.data.database.token) {
      return { job, isJobOfUser: false };
    }
    await db.authenticate(session.data.database.token);

    const checkUserOfJob = await db.query('select * from $auth.id == $user_id', {
      user_id: job.user_id,
    });
    const [userOfJobResult] = checkUserOfJob;
    let userOfJob: boolean | null = null;

    if (Array.isArray(userOfJobResult?.result)) {
      const rawResult = userOfJobResult.result[0];
    
      // Perform any checks or conversions you need to ensure it's a boolean
      if (typeof rawResult === 'boolean') {
        userOfJob = rawResult;
      } else {
        // Handle unexpected types
        throw new Error(`Unexpected type ${typeof rawResult}`);
      }
    }
    
    
    return { job, isJobOfUser: userOfJob };
  } catch (error) {
    // Log the error and handle it as you wish
    console.error(error);
    throw error;
  }
});

export type JobLoaderResult = ReturnType<typeof useJobLoader>;
export const contextJobLoader = createContextId<JobLoaderResult>("JobLoaderResult");

export const useUserJobAction = routeAction$(async (data, { env, params, sharedMap }) => {
  const session = schemaMySession.safeParse(sharedMap.get('session'));
  if (session.success === false) {
    throw new Error('Invalid session');
  }
  const db = new Surreal();
  await db.connect(env.get("ROUTE")!, {
    auth: session.data.database.token,
    ns: env.get('NAMESPACE')!,
    db: env.get('DATABASE')!,
  });
  const job = await db.update(params.jobId, data);
  return {job, updated: true};
}, zod$(z.object({
  title: z.string(),
  description: z.string(),
  published: z.boolean(),
  created_at: z.date().or(z.string()),
})));


export default component$(() => {
  const job = useJobLoader();
  useContextProvider(contextJobLoader, job);
  const watchStateSignal = useSignal(() => {
    return job.value.job.description === '' || job.value.job.title === ''  ? !job.value.isJobOfUser : true;
  });
  const toggelWatchState = $(() => watchStateSignal.value = !watchStateSignal.value);
  
  return (
    <div class={' px-4 lg:px-6 py-8'}>
      <section class={'container bg-white rounded-md flex flex-col mx-auto max-w-screen-xl gap-4 p-4 shadow-md shadow-sky-700/50 min-h-[600px]'}>
      {watchStateSignal.value ? 
      <ViewJobState onClick$={toggelWatchState} key={"view-job-state"} /> 
      : <EditJobState onClick$={toggelWatchState} key={'edit-job-state'}/> }
      </section>
    </div>
  );
});

export type JobStateProps = {onClick$: QRL<() => boolean>}

export const ViewJobState = component$((props: JobStateProps) => {
  const job = useContext(contextJobLoader);

  return <Fragment key={'watch'}>
  <div class={'flex justify-between sm:flex-row flex-col-reverse gap-4'}>
    <h1 class={'text-3xl text-sky-900 font-bold'}>{job.value.job.title || "כותרת למשרה"}</h1>
     <div class={'flex gap-4 items-center'}>{job.value.isJobOfUser &&<button onClick$={props.onClick$} class={'p-4 bg-sky-950 grid place-content-center rounded-lg grid-flow-col gap-2'}>
        <span class={'text-sky-50'}>ערוך</span>
        <svg xmlns="http://www.w3.org/2000/svg" 
          class={'fill-sky-50'} width="16" height="16" viewBox="0 0 256 256">
          <path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31l83.67-83.66,3.48,13.9-36.8,36.79a8,8,0,0,0,11.31,11.32l40-40a8,8,0,0,0,2.11-7.6l-6.9-27.61L227.32,96A16,16,0,0,0,227.32,73.37ZM48,179.31,76.69,208H48Zm48,25.38L51.31,160,136,75.31,180.69,120Zm96-96L147.32,64l24-24L216,84.69Z">
            </path>
        </svg>
      </button>}<Link class={'text-sky-950 italic px-4 py-2 rounded'} href='/health-jobs/'>חזרה למשרות</Link></div>
  </div>
  <p class={'text-xl text-sky-950'}>{job.value.job.description || 'ריק ממש המשרה שאין בה כלום'}</p>
</Fragment> 
});

export const EditJobState = component$((props: JobStateProps) => {
  const action = useUserJobAction();
  const nav = useNavigate();
  const job = useContext(contextJobLoader);
  const title = useSignal(job.value.job.title);
  const description = useSignal(job.value.job.description);
  const publish = useSignal(job.value.job.published);
  const textPublishBtn = useComputed$(() => job.value.job.published ? 'הסתר פרסום' : 'פרסם');
  const runingStateText = useComputed$(() => action.isRunning ? 'מעדכן את המשרה' : 'משרה מעודכנת');
  const toggelPublish = $(async () => {
    publish.value = !publish.value;
    await action.submit({
      title: title.value,
      description: description.value,
      published: publish.value,
      created_at: job.value.job.created_at,
    });
    if (action.status === 200) {
      setTimeout( () => nav(`/health-jobs/`), 0)
    }
  });
  
  useTask$(({track, cleanup}) => {
    const titleValue = track(() => title.value);
    const descriptionValue = track(() => description.value);
    const update = setTimeout(async () => {    
      await action.submit({
        title: titleValue,
        description: descriptionValue,
        published: publish.value,
        created_at: job.value.job.created_at,
      })}, 600);
    cleanup(() => clearTimeout(update));
  });
  
  return <Fragment key={'edit'}>
  <span class={'px-2 py-1 bg-indigo-700/30 text-indigo-900 place-self-start rounded'}>{runingStateText.value}</span>
  <input 
    type="text" 
    placeholder='כותרת המשרה' 
    bind:value={title} 
    class={'p-4 bg-sky-200 max-w-[400px] text-sky-950 placeholder:text-sky-800/90  grid place-content-center rounded-lg grid-flow-col gap-2'} />
  <textarea 
    bind:value={description} 
    rows={15} 
    placeholder='תוכן המשרה' class={'p-4 bg-sky-200 max-w-[700px] text-sky-950 placeholder:text-sky-800/90  grid place-content-center rounded-lg grid-flow-col gap-2'}></textarea>
  <div class={'mt-auto flex gap-8'}>
    <button onClick$={toggelPublish} class={'sm:px-12 min-[400px]:px-8 px-6  py-4 bg-sky-950  grid place-content-center rounded-lg grid-flow-col gap-2'}>
      <span class={'text-sky-50'}>{textPublishBtn.value}</span>
      <svg xmlns="http://www.w3.org/2000/svg" 
        class={'fill-sky-50'} width="16" height="16" viewBox="0 0 256 256">
        <path d="M227.32,73.37,182.63,28.69a16,16,0,0,0-22.63,0L36.69,152A15.86,15.86,0,0,0,32,163.31V208a16,16,0,0,0,16,16H92.69A15.86,15.86,0,0,0,104,219.31l83.67-83.66,3.48,13.9-36.8,36.79a8,8,0,0,0,11.31,11.32l40-40a8,8,0,0,0,2.11-7.6l-6.9-27.61L227.32,96A16,16,0,0,0,227.32,73.37ZM48,179.31,76.69,208H48Zm48,25.38L51.31,160,136,75.31,180.69,120Zm96-96L147.32,64l24-24L216,84.69Z">
          </path>
      </svg>
    </button>
    <button onClick$={props.onClick$} class={'p-4 grid place-content-center rounded-lg grid-flow-col gap-2'}>
      <span class={'text-sky-950 italic'}>חזור לצפייה</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class={'fill-sky-950'} viewBox="0 0 256 256"><path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path></svg>
    </button>
  </div>
</Fragment>
});