import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config";
import formatTime from "@/utils/formatTime";

export default function WithdrawalTable({ userId }) {
  const [accountData, setAccountData] = useState([]);

  async function getAccountData() {
    const data = await getDocument(db, "withdraw", userId);

    setAccountData(data);
  }

  useEffect(() => {
    getAccountData();
  }, [userId]);

  return (
    <div>
      <h1 className="my-3 italic">withdrawals</h1>

      <div className="overflow-y-auto max-h-[50vh]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Reason</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {accountData.map((data, index) => {
              return (
                <tr key={index}>
                  <td className="p-2">{formatTime(data?.date)}</td>
                  <td className="p-2">{data?.withdrawalAmount}</td>
                  <td className="p-2">
                    <Badge variant={"destructive"}>withdrawal</Badge>
                  </td>
                  <td className="p-2">{data?.reason}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function getDocument(db, collectionName, userId) {
  const q = query(
    collection(db, collectionName),
    where("userId", "==", userId)
  );

  const querySnapShot = await getDocs(q);

  let data = [];

  querySnapShot.forEach((doc) => {
    data.push(doc.data());
  });

  return data;
}
