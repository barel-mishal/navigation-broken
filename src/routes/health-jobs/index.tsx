
import { Surreal } from 'surrealdb.js';
import { $, component$, useComputed$, useSignal } from '@builder.io/qwik';
import { routeAction$, routeLoader$, useNavigate, z, zod$ } from '@builder.io/qwik-city';
import { type MySession } from '../layout-account';
import { AuthenticateComponent } from '../layout';

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

export type JobData = Omit<Job, "id">;

export const useJobsData = routeLoader$(async ({env}) => {
  const db = new Surreal();
  await db.connect(env.get("ROUTE")!, {
    auth: {
      pass: env.get('DATABASE_PASSWORD')!,
      user: env.get('USER_DATABASE')!,
    },
    ns: env.get('NAMESPACE')!,
    db: env.get('DATABASE')!,
  });
  const payload = await db.query(`select *, time::format(created_at, "%v") as created from Jobs where published = true ORDER BY created_at DESC`) ;
  const jobs = (payload.length === 1 && payload[0].result) ? payload[0].result as unknown as JobDb[] : [] as JobDb[];
  return {
    length: jobs.length,
    jobs: jobs.slice(0, 5),
    running: [
      {title: 'טוען...', description: 'טוען...', id: 'sdflkj798dfk', created_at: Date.now()}, 
      {title: 'טוען...', description: 'טוען...', id: "dslfkj78", created_at: Date.now()}
    ],
    start: 0,
    step: 5,
  }
});

export const useJobsDataAction = routeAction$(async (data, {env}) => {
  const db = new Surreal();
  await db.connect(env.get("ROUTE")!, {
    auth: {
      pass: env.get('DATABASE_PASSWORD')!,
      user: env.get('USER_DATABASE')!,
    },
    ns: env.get('NAMESPACE')!,
    db: env.get('DATABASE')!,
  });
  const payload = await db.query(`select *, time::format(created_at, "%v") as created from Jobs where published = true ORDER BY created_at DESC`) ;
  const jobs = (payload.length === 1 && payload[0].result) ? payload[0].result as unknown as JobDb[] : [] as JobDb[];
  return {
    data: {
      length: jobs.length,
      jobs: jobs.slice(data.start, data.stop),
    }
  }
}, zod$({
  start: z.number(),
  stop: z.number(),
  search: z.string(),
}));

export const useNewJobAction = routeAction$(async (data, {sharedMap, env}) => {
  const session = sharedMap.get("session") as MySession;
  const db = new Surreal();
  await db.connect(env.get("ROUTE")!, {
    auth: session.database.token,
    ns: env.get('NAMESPACE')!,
    db: env.get('DATABASE')!,
  });
  const defaultJob: JobData = {
    description: '',
    title: '',
    published: false,
    created_at: new Date(),
  }
  const newJob: Job[] = await db.create("Jobs", defaultJob);
  return newJob.at(0)?.id;
});

export const useJobSearchAction = routeAction$(async (data, {env}) => {
  const db = new Surreal();
  await db.connect(env.get("ROUTE")!, {
    auth: {
      pass: env.get('DATABASE_PASSWORD')!,
      user: env.get('USER_DATABASE')!,
    },
    ns: env.get('NAMESPACE')!,
    db: env.get('DATABASE')!,
  });
  const query = `select *, time::format(created_at, "%v") as created from Jobs
  where published = true AND (title ~ $search) ORDER BY created_at DESC`
  const payload = await db.query(query, {search: data.search}) ;
  const jobs = (payload.length === 1 && payload[0].result) ? payload[0].result as unknown as JobDb[] : [] as JobDb[];
  return {
    data: {
      length: jobs.length,
      jobs: jobs,
    }
  }
}, zod$({
  start: z.number(),
  stop: z.number(),
  search: z.string(),
  }));

export const useJobsPaginationAndSearch = () => {
  const searchAction = useJobSearchAction();
  const searchSignal = useSignal<string>('');
  const payLoad = useJobsData();
  const DEFAULT_JOBS_DATA = {
    length: 2, 
    jobs: payLoad.value.running
  };
  const STOP_NUMBER = 1;
  const actionData = useJobsDataAction();
  const startSignal = useSignal<number>(payLoad.value.start);
  const stepSignal = useSignal<number>(payLoad.value.step);
  const cumputeSearch = useComputed$(async () => {
    if (searchSignal.value === '') return false;
    if (searchAction.isRunning) return false;
    if (searchAction.status !== 200) return false;
    return searchAction.value!.data!;
  });
  const cumputeJobsData = useComputed$(async () => {
    if (actionData.isRunning) return {
      length: 2, 
      jobs: payLoad.value.running
    };

    if (cumputeSearch.value ) return cumputeSearch.value || DEFAULT_JOBS_DATA;

    if (actionData.status === 200) return actionData.value!.data! as {length: number, jobs: Job[]};
    return payLoad.value
  });
  const cumputeJobsLength = useComputed$(() => {
    return cumputeJobsData.value.length ?? 0;
  });
  const isAllowPagination = useComputed$(() => {
    return cumputeJobsLength.value > stepSignal.value;
  });
  const allowNext = useComputed$(async () => {
    return startSignal.value  >= cumputeJobsLength.value - STOP_NUMBER;
  });
  const allowPrev = useComputed$(() => {
    return startSignal.value <= 0;
  });
  const cumputeNextTitle = useComputed$(async () => {
    if (isAllowPagination.value === false) return null;
    return allowNext.value ? 'אין עוד משרות' : `החמש הבאים (${startSignal.value}/${cumputeJobsLength.value})`;
  });
  const cumputePrevTitle = useComputed$(async () => {
    return allowPrev.value ? null : `החמש הקודמים (${startSignal.value}/${cumputeJobsLength.value})`;
  }); 
  const next = $(async () => {
    if (allowNext.value) return;
    const newStart = startSignal.value + stepSignal.value;
    const newStop = newStart + stepSignal.value;
    startSignal.value = newStart >= cumputeJobsLength.value ? cumputeJobsLength.value - STOP_NUMBER : newStart;
    actionData.submit({
      start: startSignal.value,
      stop: newStop > cumputeJobsLength.value ? cumputeJobsLength.value : newStop,
      search: searchSignal.value,
    })
  });
  const prev = $(async () => {
    if (allowPrev.value) return;
    const newStart = startSignal.value - stepSignal.value;
    startSignal.value = newStart <= 0 ? 0 : newStart;
    actionData.submit({
      start: startSignal.value,
      stop: startSignal.value + stepSignal.value ,
      search: searchSignal.value,
    })
  });
  const search = $(async (event: Event, element: HTMLInputElement) => {
    searchSignal.value = element.value
    await searchAction.submit({
      start: 0,
      stop: stepSignal.value,
      search: searchSignal.value,
    });
  });
  return {
    searchSignal,
    next,
    prev,
    cumputeNextTitle,
    cumputePrevTitle,
    allowNext,
    allowPrev,
    cumputeJobsData,
    search,
    cumputeSearch
  }
}



export default component$(() => {
  const psCTX = useJobsPaginationAndSearch();
  const action = useNewJobAction();
  const nav = useNavigate();
  const newJob = $(async () => {
    if (action.isRunning) return;
    const data = await action.submit();
    if (!data) return;
    if (data.status !== 200) return;
    setTimeout( () => nav(`/health-jobs/${data.value}`), 0)
  });

 

  return (
      <div class="text-gray-600 body-font">
        <div class="container mx-auto bg-white rounded-md shadow-lg shadow-sky-950/30 mt-6 divide-y-2">
          <div class={'px-4 py-8 '}>
          <div class={'grid place-content-start py-8'}>
            <AuthenticateComponent>
              <button onClick$={newJob} disabled={action.isRunning} class={'px-8 py-4 flex gap-8 items-center bg-indigo-700 text-indigo-50 rounded-md disabled:bg-indigo-400'}>
                {!action.isRunning ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg> :
                <svg xmlns="http://www.w3.org/2000/svg" class={'fill-indigo-50/80 animate-spin'} width="24" height="24" viewBox="0 0 256 256"><path d="M232,128a104,104,0,0,1-208,0c0-41,23.81-78.36,60.66-95.27a8,8,0,0,1,6.68,14.54C60.15,61.59,40,93.27,40,128a88,88,0,0,0,176,0c0-34.73-20.15-66.41-51.34-80.73a8,8,0,0,1,6.68-14.54C208.19,49.64,232,87,232,128Z"></path></svg>}
                {action.isRunning ? <span>מכינים את המשרה</span> : <span>יצירת משרה חדשה</span>}
              </button>
            </AuthenticateComponent>
          </div>
            <section class={'flex gap-8 flex-wrap'}>
              <input 
                type="text" 
                placeholder='חיפוש'
                id='input-search-jobs' 
                value={psCTX.searchSignal.value}
                onInput$={psCTX.search} 
                class={'px-2 py-4 bg-sky-100 ring-2 ring-sky-100 rounded-md md:min-w-[370px] min-w-[250px] outline-none focus-visible:ring-sky-700 text-sky-950 placeholder:text-sky-700'} />
              <button class={'disabled:text-sky-300 text-sky-950'} disabled={psCTX.allowNext.value} onClick$={psCTX.next}>{psCTX.cumputeNextTitle.value}</button>
              <button class={'disabled:text-sky-300 text-sky-950'} disabled={psCTX.allowPrev.value} onClick$={psCTX.prev}>{psCTX.cumputePrevTitle.value}</button>
            </section>
          </div>
          <div class={'px-4 py-2 '}>
            <section class="my-8 max-w-3xl divide-y-2">
              <h2 class={'text-5xl font-bold'}>משרות</h2>
              {psCTX.cumputeJobsData.value.jobs.map((job) => {
                return <JobCard job={job as JobCardProps}  key={job.title}/>
              })}
            </section>
          </div>
          <div class={'px-4 py-8 flex justify-center'}>
            <section class={'flex gap-8'}>
              <button class={'disabled:text-sky-300 text-sky-950'} disabled={psCTX.allowNext.value} onClick$={psCTX.next}>{psCTX.cumputeNextTitle.value}</button>
              <button class={'disabled:text-sky-300 text-sky-950'} disabled={psCTX.allowPrev.value} onClick$={psCTX.prev}>{psCTX.cumputePrevTitle.value}</button>
            </section>
          </div>
        </div>
      </div>
  );
});

interface JobCardProps extends Job {
  created: string;
}
export const JobCard = component$((props: {job: JobCardProps}) => {
  return <div class="py-8 flex flex-wrap md:flex-nowrap gap-2 md:gap-0">
  <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
    <span class="mt-1 text-gray-500 text-sm">{props.job.created as string}</span>
  </div>
  <div class="md:flex-grow">
    <h2 class="text-2xl font-medium text-gray-900 title-font mb-2">{props.job.title}</h2>
    <p class="leading-relaxed">{props.job.description}</p>
    <a class="text-indigo-500 inline-flex items-center mt-4" href={`/health-jobs/${props.job.id}`}>הצג בדף נפרד 
      <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    </a>
  </div>
</div>
})

// npm run build.types
// npm run build.client
// npm run build.server
// npm run lint