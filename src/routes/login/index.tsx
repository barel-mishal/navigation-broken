import { Slot, component$ } from "@builder.io/qwik";
import { Form, type RequestHandler } from "@builder.io/qwik-city";
import { useAuthSignin } from "../plugin@auth";
import { type Session } from "@auth/core/types";

export const onRequest: RequestHandler = (event) => {
  const session: Session | null = event.sharedMap.get('session');
  if (!session || new Date(session.expires) < new Date()) {
    return  
  }
  throw event.redirect(302, '/dashboard');
};

export default component$(() => {

    const authSignIn = useAuthSignin();
    return <div>
      <div class="max-w-lg mx-auto my-10 bg-white p-8 rounded-xl shadow shadow-slate-300">
        <h1 class="text-4xl font-medium">התחברות והרשמה</h1>
        <p class="text-slate-500">ברוך הבא!</p>

        <div class="my-5">
        <Form action={authSignIn} class="">
          <input type="hidden" name="providerId" value="google" />
          <input type="hidden" name="options.callbackUrl" value={'/'} />
          <input type="hidden" name="authorizationParams" value={JSON.stringify({trigger: 'signUp'})} />
          <LogInProviderButton providerName='Google' text='כניסה עם גוגל' >
              <div q:slot='login-icon-button-slot'>{JSX_GOOGLE_ICON}</div>
          </LogInProviderButton>
        </Form>
        </div>
        <form action="" class="my-10">
            <div class="flex flex-col space-y-5">
                <label for="email">
                    <p class="font-medium text-slate-700 pb-2">מייל</p>
                    <input id="email" name="email" type="email" class="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter email address"/>
                </label>
                <label for="password">
                    <p class="font-medium text-slate-700 pb-2">סיסמה</p>
                    <input id="password" name="password" type="password" class="w-full py-3 border border-slate-200 rounded-lg px-3 focus:outline-none focus:border-slate-500 hover:shadow" placeholder="Enter your password"/>
                </label>
                <div class="flex flex-row justify-between">
                    <div>
                    </div>
                    <div>
                        <a href="#" class="font-medium text-indigo-600">שכחתי סיסמה?</a>
                    </div>
                </div>
                <button class="w-full py-3 font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg border-indigo-500 hover:shadow inline-flex space-x-2 items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      <span>Login</span>
                </button>
                <p class="flex gap-2 justify-center"><span>עדיין לא רשום?</span><a href="#" class="text-indigo-600 font-medium inline-flex space-x-1 items-center"><span>להרשמה</span><span><svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg></span></a></p>
            </div>
        </form>
    </div>
    </div>
})

export const LogInProviderButton = component$((props: {providerName: 'GitHub' | 'Google', text?: string}) => {
    return (
    <button class={'w-full text-center py-3 my-3 border flex space-x-2 items-center justify-center border-slate-200 rounded-lg text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:shadow transition duration-150 gap-2'}> 
      <span class={''}>
        <Slot key={'login-icon-button-slot'} name='login-icon-button-slot'  />
      </span>
      <p class={'font-semibold tracking-tight m-0'}>{props?.text ?? props.providerName}</p>
    </button>
    )
  });
  
  export const JSX_GOOGLE_ICON =  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 512 512" style="shape-rendering:geometricPrecision;text-rendering:geometricPrecision;image-rendering:optimizeQuality;fill-rule:evenodd;clip-rule:evenodd"><path style="opacity:.986" fill="#e94134" d="M121.5 208.5a3957.606 3957.606 0 0 1-83-65C74.157 75.97 129.158 32.803 203.5 14c81.766-17.307 154.766.36 219 53 2.454 1.74 3.954 3.907 4.5 6.5L357.5 143c-1 .667-2 .667-3 0-32.445-29.144-70.445-40.811-114-35-58.488 11.329-98.155 44.829-119 100.5Z"/><path style="opacity:.989" fill="#f9ba08" d="M38.5 143.5a3957.606 3957.606 0 0 0 83 65c-7.574 23.557-9.408 47.557-5.5 72a578.182 578.182 0 0 0 5.5 23 1922.588 1922.588 0 0 0-83 64C7.38 304.038 3.214 238.705 26 171.5a206.575 206.575 0 0 1 12.5-28Z"/><path style="opacity:.99" fill="#4285f3" d="m425.5 443.5-80-63c26.791-18.483 43.124-43.816 49-76h-134v-96c78.237-.332 156.404.002 234.5 1 9.728 56.114 3.728 110.447-18 163-12.386 27.207-29.553 50.873-51.5 71Z"/><path style="opacity:.988" fill="#34a753" d="M121.5 303.5c16.149 43.091 45.482 73.591 88 91.5 47.647 16.069 92.981 11.236 136-14.5l80 63c-34.047 30.85-74.047 49.684-120 56.5-94.918 13.48-174.084-15.353-237.5-86.5a237.262 237.262 0 0 1-29.5-46 1922.588 1922.588 0 0 1 83-64Z"/></svg>
  export const JSX_GITHUB_ICON = <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="32" height="32" viewBox="0 0 30 30"><path d="M15,3C8.373,3,3,8.373,3,15c0,5.623,3.872,10.328,9.092,11.63C12.036,26.468,12,26.28,12,26.047v-2.051 c-0.487,0-1.303,0-1.508,0c-0.821,0-1.551-0.353-1.905-1.009c-0.393-0.729-0.461-1.844-1.435-2.526 c-0.289-0.227-0.069-0.486,0.264-0.451c0.615,0.174,1.125,0.596,1.605,1.222c0.478,0.627,0.703,0.769,1.596,0.769 c0.433,0,1.081-0.025,1.691-0.121c0.328-0.833,0.895-1.6,1.588-1.962c-3.996-0.411-5.903-2.399-5.903-5.098 c0-1.162,0.495-2.286,1.336-3.233C9.053,10.647,8.706,8.73,9.435,8c1.798,0,2.885,1.166,3.146,1.481C13.477,9.174,14.461,9,15.495,9 c1.036,0,2.024,0.174,2.922,0.483C18.675,9.17,19.763,8,21.565,8c0.732,0.731,0.381,2.656,0.102,3.594 c0.836,0.945,1.328,2.066,1.328,3.226c0,2.697-1.904,4.684-5.894,5.097C18.199,20.49,19,22.1,19,23.313v2.734 c0,0.104-0.023,0.179-0.035,0.268C23.641,24.676,27,20.236,27,15C27,8.373,21.627,3,15,3z"></path></svg>
  