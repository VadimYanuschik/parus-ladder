import {collection, getDocs, limit, orderBy, query} from "firebase/firestore";
import {db} from "../firebase/firebase.config";
import {isPossibleUpdateTables} from "./LeaderTableHelpers";

export async function fetchLastUpdate() {
    const q = query(collection(db, "tableUpdates"), orderBy("updatedAt", "desc"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const updateDate = querySnapshot.docs[0].data().updatedAt.toDate();
        const {isPossible, diffHours} = isPossibleUpdateTables(updateDate);

        return {isPossible, diffHours}
    }
    return {isPossible: true, diffHours: 0}
}