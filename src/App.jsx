import { useEffect, useState } from "react";
import { ModeToggle } from "./components/mode-toggle";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router";
import { auth } from "./config";
import { Button } from "./components/ui/button";
import { LogOutIcon } from "lucide-react";
import Actions from "./components/Banking";
import { Toaster } from "react-hot-toast";
import DepositTable from "./components/depositTable";
import WithdrawalTable from "./components/withdrawalTable";
import Graph from "./components/Graph";

export default function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/sign-in");
      }

      setUser(user);
    });
  }, []);

  function signOutHandler() {
    try {
      signOut(auth)
        .then(() => {
          navigate("/sign-in");
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log("error", error);
    }
  }

  return (
    <>
      <Toaster />
      <div className="my-4 mx-2">
        <ModeToggle />
        <Button onClick={signOutHandler} variant="destructive">
          <LogOutIcon />
        </Button>
      </div>
      <div className="my-4 mx-4 flex flex-col ">
        <div className="flex md:items-center mx-5">
          <Actions userId={user?.uid} />
        </div>

        <div className="mx-auto md:w-[950px] flex  space-y-5 md:flex-row gap-4 mt-[17px]">
          <div className="flex flex-col space-y-6 mx-4">
            <div>
              <WithdrawalTable userId={user?.uid} />
            </div>

            <hr />
            <div>
              <DepositTable userId={user?.uid} />
            </div>
          </div>

          <div className="mt-4">
            <Graph userId={user?.uid} />
          </div>
        </div>
      </div>
    </>
  );
}
