import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Banknote } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

import {
  getAccountData,
  setDepAmount,
  setMonthTarget,
  setSavingTarget,
} from "./services";
import { useNavigate } from "react-router";

export default function Account({ userId }) {
  const navigate = useNavigate();
  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [savingTargetAmount, setSavingTargetAmount] = useState("");

  const [accountData, setAccountData] = useState(null);

  useEffect(() => {
    const data = getAccountData(userId);
    setAccountData(data);
  }, [userId]);

  async function handleSetMonthTarget() {
    await setMonthTarget(monthlyTarget, accountData, userId).then(() => {
      navigate(0);
    });
  }

  async function handleSetSavingTarget() {
    await setSavingTarget(savingTargetAmount, accountData, userId).then(() => {
      navigate(0);
    });
  }

  async function handleDeposit() {
    await setDepAmount(depositAmount, userId).then(() => {
      navigate(0);
    });
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button>
            <Banknote /> Account
          </Button>
        </DialogTrigger>

        <DialogContent>
          <Card className="w-full max-w-md border-none">
            <CardHeader>
              <CardTitle>Saving Account</CardTitle>
              <CardDescription>Manage your monthly savings</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label>Monthly Savings Target (for this month)</Label>

                <div className="flex item-center gap-2">
                  <Input
                    id="target"
                    type="number"
                    placeholder="100"
                    value={monthlyTarget}
                    onChange={(event) => setMonthlyTarget(event.target.value)}
                  />

                  <Button
                    onClick={handleSetMonthTarget}
                    variant="outline"
                    size="sm"
                  >
                    Set Target{" "}
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Deposit</Label>

                <div className="flex item-center gap-2">
                  <Input
                    id="deposit"
                    type="number"
                    placeholder="50"
                    value={depositAmount}
                    onChange={(event) => setDepositAmount(event.target.value)}
                  />

                  <Button onClick={handleDeposit} variant="outline" size="sm">
                    Deposit
                  </Button>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between flex-col space-y-4">
              <div className="grid gap-2">
                <Label>Saving Target Amount</Label>

                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="100"
                    value={savingTargetAmount}
                    onChange={(event) =>
                      setSavingTargetAmount(event.target.value)
                    }
                  />

                  <Button
                    onClick={handleSetSavingTarget}
                    variant="outline"
                    size="sm"
                  >
                    set savings Target
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
