import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config";
import formatTime from "@/utils/formatTime";

export default function DepositTable({ userId }) {
  const [accountData, setAccountData] = useState([]);

  async function getAccountData() {
    const data = await getDocument(db, "deposits", userId);

    setAccountData(data);
  }

  useEffect(() => {
    getAccountData();
  }, [userId]);

  return (
    <div>
      <h1 className="my-3 italic">deposits</h1>

      <div className="overflow-y-auto max-h-[50vh]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-200 text-xs font-semibold text-gray-600 uppercase sticky top-0 z-10">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Type</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {accountData.map((data, index) => {
              return (
                <tr key={index}>
                  <td className="p-2">{formatTime(data?.date)}</td>
                  <td className="p-2">{data?.depositAmount}</td>
                  <td className="p-2">
                    <Badge variant={"secondary"}>deposit</Badge>
                  </td>
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
    console.group(doc.data());
    data.push(doc.data());
  });

  return data;
}
