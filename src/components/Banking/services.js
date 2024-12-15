import { db } from "@/config";
import { getDoc, doc, updateDoc, addDoc, collection } from "firebase/firestore";
import { toast } from "react-hot-toast";
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

async function getDocument(collection, docId) {
  const docRef = doc(db, collection, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  } else {
    console.log("No such document");
  }
}

async function getAccountData(userId) {
  const data = await getDocument(db, "account", userId);

  return data;
}

async function setMonthTarget(monthlyTarget, accountData, userId) {
  // validate monthly target
  if (monthlyTarget < 0) {
    toast.error("No target amount");
  }

  // create document reference
  const docRef = doc(db, "accounts", userId);
  try {
    const account = { ...accountData };

    //   prepare data for the new month
    const currentMonth = new Date().getMonth();

    const newMonthlyData = {
      month: months[currentMonth],
      monthlyTarget: monthlyTarget,
    };

    if (!account.monthlyAccountSavings) {
      account.monthlyAccountSavings = [];
    }

    //   check the if the current month data exists
    const existingMonthData = account.monthlyAccountSavings.find(
      (data) => data.month === months[currentMonth]
    );

    if (existingMonthData) {
      existingMonthData.monthlyTarget = monthlyTarget;
    } else {
      account.monthlyAccountSavings.push(newMonthlyData);
    }

    // update the document in firestore
    await updateDoc(docRef, account);

    toast.success("Monthly Target is set");
  } catch (error) {
    console.log(error);
  }
}

async function setDepAmount(depositAmount, userId) {
  const docRef = doc(db, "accounts", userId);

  try {
    const parseDepositAmount = parseInt(depositAmount);
    if (isNaN(parseDepositAmount) || parseDepositAmount < 0) {
      toast.error("Invalid deposit amount");
      return;
    }

    const docSnap = await getDoc(docRef);

    let account = { ...docSnap.data() };

    account.depositAmount = account.depositAmount + parseDepositAmount;

    //   update firestore

    await updateDoc(docRef, { depositAmount: account.depositAmount });

    //   record the deposit in a separate collection

    const depositRecord = {
      depositAmount: parseDepositAmount,
      date: new Date(),
      userId: userId,
    };

    await addDoc(collection(db, "deposits"), depositRecord);

    toast.success("Deposit success");
    return account;
  } catch (error) {
    console.log(error);
  }
}

async function setSavingTarget(savingTargetAmount, accountData, userId) {
  if (savingTargetAmount < 1) {
    toast.error("Invalid target amount");
    return;
  }

  const docRef = doc(db, "accounts", userId);

  try {
    const account = { ...accountData };

    account.savingTarget = 0;

    let data = {
      savingTarget: savingTargetAmount,
    };

    if (account.hasOwnProperty("savingTarget")) {
      account.savingTarget = 0;

      await updateDoc(docRef, {
        ...data,
      });

      toast.success("saving target is set");
    }
  } catch (error) {
    console.log(error);
  }
}

export { setSavingTarget, setDepAmount, setMonthTarget, getAccountData };
