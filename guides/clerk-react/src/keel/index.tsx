import { useAuth } from "@clerk/clerk-react";
import { APIClient } from "./keelClient";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface KeelContextType {
  authenticated: boolean;
  keel: APIClient | null;
}

const KeelContext = createContext<KeelContextType>({
  authenticated: false,
  keel: null,
});

export const KeelProvider = (props: PropsWithChildren) => {
  const { getToken, sessionId } = useAuth();
  const [authenticated, setAuthenticated] = useState(false);

  const clientRef = useRef(
    new APIClient({
      baseUrl: "http://localhost:8000/api",
    })
  );

  const keel = clientRef.current;

  // Exchange the Clerk token for a Keel token
  useEffect(() => {
    const token = async () => {
      const t = await getToken({ template: "keel" });

      if (!t) {
        keel.client.clearToken();
        console.log("keel token cleared");
        setAuthenticated(false);
        return;
      }

      fetch("http://localhost:8000/auth/token", {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "token_exchange",
          subject_token: t,
        }),
      })
        .then(function (response) {
          return response.json();
        })
        .then(function (res) {
          if (res.access_token) {
            keel.client.setToken(res.access_token);
            setAuthenticated(true);
            console.log("keel token set");
          }
        })
        .catch(function (error) {
          console.error("Token exchange failed", error);
        });
    };

    token();
  }, [getToken, sessionId, keel]);

  return (
    <KeelContext.Provider value={{ authenticated, keel }}>
      {props.children}
    </KeelContext.Provider>
  );
};

export const useKeel = () => {
  const keelContext = useContext<KeelContextType>(KeelContext);

  if (!keelContext) {
    throw new Error("useKeel must be used within a KeelProvider");
  }

  return keelContext;
};
