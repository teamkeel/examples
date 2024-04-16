"use client"
import { useCallback, useEffect, useState } from "react";
import { Thing } from "../../keel/keelClient";
import { useKeel } from "./keel";

export default function Home() {
  const [things, setThings] = useState<Thing[]>([]);
  const { api, auth } = useKeel()
  const isAuthenticated = auth.isAuthenticated;
  const fetchThings = useCallback(() => {
    api.queries.myThings().then((res) => {
      if (res.error) {
        console.error(res.error);
      }
      if (res.data) {
        setThings(res.data.results);
      }
    });
  }, [api]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchThings();
  }, [isAuthenticated, fetchThings]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    api.mutations
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