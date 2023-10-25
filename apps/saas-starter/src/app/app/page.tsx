export default function AppHome() {
  return (
    <div className="grid max-w-screen-lg gap-4 p-16 mx-auto">
      <h1 className="text-5xl font-bold">Keel SaaS Starter</h1>
      <p className="leading-7 first:mt-0">
        Welcome to the Keel SaaS starter app! Keel gives you an instant
        fullstack API that can use to power your applications with zero stress.
        It abstracts away a huge chunk of the difficulties that come with
        building fullstack applications with low code.
      </p>
      <p className="leading-7 first:mt-0">
        This app defines an API with models and defines various operations that
        can be performed on the API. In this&nbsp;
        <a
          href="https://www.investopedia.com/terms/s/software-as-a-service-saas.asp"
          target="_blank"
          rel="noreferrer"
          className="text-primary-600 underline decoration-from-font [text-underline-position:from-font]"
        >
          SaaS app
        </a>
        , we cover the following cases:
      </p>
      <ul className="list-disc list-inside first:mt-0 ltr:ml-6 rtl:mr-6">
        <li className="my-2">Creating complex models for your data on Keel,</li>
        <li className="my-2">
          Creating an API with full-fledged authentication capabilities,
        </li>
        <li className="my-2">
          Using secrets to manage sensitive credentials, and
        </li>
        <li className="my-2">Writing custom functions for your APIs.</li>
      </ul>
      <p>
        If at any time you find yourself having a hard time with this tutorial,
        please either refer to the{' '}
        <a
          href="https://docs.keel.xyz/advanced-tutorial"
          target="_blank"
          rel="noopener noreferrer"
        >
          documentation
        </a>
        , or reach out to us on{' '}
        <a
          href="https://keel.so/discord"
          target="_blank"
          rel="noreferrer noopener"
        >
          Discord
        </a>
        .
      </p>
    </div>
  );
}
