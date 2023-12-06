import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import { KeelProvider, useKeel } from "./keel";
import { useCallback, useEffect, useState } from "react";
import { Thing } from "./keel/keelClient";

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <KeelProvider>
        <SignedIn>
          <Welcome />
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </KeelProvider>
    </ClerkProvider>
  );
}

function Welcome() {
  const [things, setThings] = useState<Thing[]>([]);
  const { keel, authenticated } = useKeel();

  const fetchThings = useCallback(() => {
    keel?.api.queries.myThings().then((res) => {
      if (res.error) {
        console.error(res.error);
      }
      if (res.data) {
        setThings(res.data.results);
      }
    });
  }, [keel]);

  useEffect(() => {
    if (!authenticated) return;
    fetchThings();
  }, [authenticated, fetchThings]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    keel?.api.mutations
      .createThing({
        name: e.currentTarget.thing.value,
      })
      .then(() => fetchThings());
  };

  return (
    <>
      <h1>Welcome</h1>
      <p>Here are your things</p>
      <ul>
        {things.map((thing) => (
          <li key={thing.id}>{thing.name}</li>
        ))}
      </ul>

      <hr />

      <form onSubmit={handleSubmit}>
        <div className="fields">
          <input name="thing" type="text" />
          <button type="submit">Add thing</button>
        </div>
      </form>
    </>
  );
}

export default App;
