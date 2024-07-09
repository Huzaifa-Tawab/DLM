import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";

export default function PlotsOffer({ id }) {
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    getPlotOffers();
  }, []);

  async function getPlotOffers() {
    const q = query(collection(db, "ListingOffers"), where("Plot", "==", id));
    const querySnapshot = await getDocs(q);
    let temp = [];
    querySnapshot.forEach((doc) => {
      temp.push({ ...doc.data(), id: doc.id });
    });
    const sortedOffers = temp.sort((a, b) => b.createdAt - a.createdAt);
    setOffers(sortedOffers);
  }

  return (
    <>
      {offers.map((offer) => (
        <div
          key={offer.id}
          style={{
            marginBottom: "10px",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#f0f0f0",
          }}
        >
          <h4 style={{ margin: "5px 0" }}>
            <strong>{offer.uid}</strong> offered <strong>{offer.Price} PKR</strong> for plot <strong>{offer.Plot}</strong>
          </h4>
          <h4 style={{ margin: "5px 0" }}>
            At {new Date(offer.time.seconds * 1000).toDateString()} ({offer.status})
          </h4>
        </div>
      ))}
    </>
  );
}
