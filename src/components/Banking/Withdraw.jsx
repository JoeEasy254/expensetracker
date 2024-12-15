import { HandCoinsIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogTrigger, DialogContent } from "../ui/dialog";
import { useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { db } from "@/config";
import { useNavigate } from "react-router";

export default function Withdraw({ userId }) {
  const navigate = useNavigate();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [reason, setReason] = useState("");
  const [accountData, setAccountData] = useState(null);

  async function getAccountData() {
    const data = await getDocument(db, "accounts", userId);

    setAccountData(data);
  }

  useEffect(() => {
    getAccountData();
  }, [userId]);

  async function executeWithdawal(e) {
    e.preventDefault();
    const withdrawalAmt = parseInt(withdrawalAmount);

    if (withdrawalAmt > 0 && withdrawalAmt > accountData?.depositAmount) {
      return toast.error("Insufficient funds ");
    }

    const docRef = doc(db, "accounts", userId);
    try {
      const account = { ...accountData };

      if (
        account.hasOwnProperty("depositAmount") &&
        account.depositAmount < 1
      ) {
        return toast.error("Insufficient funds ");
      } else {
        let depAmount = account.depositAmount;

        depAmount -= withdrawalAmt;

        const withdraw = {
          withdrawalAmount: withdrawalAmt,
          reason,
          date: new Date(),
          userId,
        };

        await addDoc(collection(db, "withdraw"), withdraw);

        await updateDoc(docRef, { depositAmount: depAmount });

        toast.success("withdrawal successful");

        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>
            <HandCoinsIcon /> witdraw
          </Button>
        </DialogTrigger>

        <DialogContent>
          <Card className="w-full max-w-md border-none">
            <CardHeader>
              <CardTitle>Transfer</CardTitle>
              <CardDescription>withdraw from account</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium">
                  <Button>Balance</Button>
                  <span>{accountData?.depositAmount}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <form>
                  <Label>withdraw</Label>
                  <Input
                    type="number"
                    placeholder="100"
                    value={withdrawalAmount}
                    onChange={(event) =>
                      setWithdrawalAmount(event.target.value)
                    }
                  />

                  <Textarea
                    placeholder="reason"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                  />

                  <Button
                    onClick={executeWithdawal}
                    type="submit"
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                  >
                    witdraw
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}

async function getDocument(db, collection, docId) {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document");
  }
}
