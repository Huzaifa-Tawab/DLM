import React, { useState } from "react";
import "./schedule.css";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import softx from "../../Assets/SoftXion.png";
import dlmDiagram from "../../assets/dimDiag.jpg";
function Schedule() {
  const { id } = useParams();
  const [Total, setTotal] = useState("");
  const [SecheduleData, setSecheduleData] = useState({});
  useEffect(() => {
    getBookingInfo();
  }, []);
  async function getBookingInfo() {
    const plot = doc(db, "Plots", id);
    const PlotData = await getDoc(plot);
    if (PlotData.exists()) {
      setSecheduleData(PlotData.data());
      console.log(PlotData.data());
    }
  }
  return (
    <>
      <div className="schedule-main">
        <div className="schedule-head">
          <h2>Greeting Letter</h2>
          <div className="schedule-subject">
            <span>
              Dear: <strong>{SecheduleData.CustomerName}</strong>
            </span>
          </div>
        </div>
        <div className="schedule-desc">
          <p>
            On behalf of{" "}
            <strong>
              {SecheduleData.Society === "Dyanmic Land Management"
                ? "Dynamic Land Management"
                : "Property Bank"}
            </strong>
            , we extend our heartfelt congratulations to you on the successful
            purchase of your plot/shop through our web portal. We are thrilled
            to have you as a valued member of our community, and we appreciate
            your trust in choosing us for your real estate investment.
          </p>
          <br />
          <p>
            This marks the beginning of an exciting journey for you, and we are
            committed to ensuring that your experience with us is nothing short
            of exceptional. Our team is here to assist you every step of the
            way, making your property ownership a seamless and enjoyable
            process.
          </p>
          <br />
          <p>
            As a token of our appreciation, please find attached your
            personalized installment schedule outlining the payment plan for
            your plot/shop. This schedule has been tailored to provide you with
            clarity and transparency, ensuring that you can plan your finances
            accordingly.
          </p>
        </div>
        <div className="table-head-schedule">
          <h5>Schedule:-</h5>
        </div>
        <div className="">
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Booking Fee</td>
                <td>1</td>
                <td>{SecheduleData.BookingAmount} PKR</td>
                <td>{SecheduleData.BookingAmount} PKR</td>
              </tr>
              <tr>
                <td>Down Payment</td>
                <td>1</td>
                <td>{SecheduleData.Downpayment} PKR</td>
                <td>{SecheduleData.Downpayment} PKR</td>
              </tr>
              <tr>
                <td>Installment/Month</td>
                <td>{SecheduleData.InstallmentMonth}</td>
                <td>{SecheduleData.Installment} PKR</td>
                <td>
                  {SecheduleData.InstallmentMonth * SecheduleData.Installment}{" "}
                  PKR
                </td>
              </tr>
              <tr>
                <td>Position Amount</td>
                <td>1</td>
                <td>{SecheduleData.PossessionAmount} PKR</td>
                <td>{SecheduleData.PossessionAmount} PKR</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th></th>
                <th></th>
                <th>Total Amount</th>
                <th>
                  {parseInt(SecheduleData.BookingAmount) +
                    parseInt(SecheduleData.Downpayment) +
                    parseInt(SecheduleData.PossessionAmount) +
                    parseInt(SecheduleData.Installment) *
                      parseInt(SecheduleData.InstallmentMonth)}
                  PKR
                </th>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="schedule-desc-bottom">
          <p>We have recived your booking fee.</p>
          <p>
            Please review the schedule carefully, and if you have any questions
            or require further clarification, do not hesitate to reach out to
            our dedicated customer service team at [Customer Service Email/Phone
            Number]. We are here to assist you and ensure that your property
            ownership journey is as smooth as possible.
          </p>

          <p>
            Once again, congratulations on your new investment! We look forward
            to building a lasting relationship with you and hope that your
            property brings you joy, prosperity, and countless memorable
            moments.
          </p>

          <p>
            This is a system-generated form and is valid for 60 days from the
            date of booking. Once it is cancelled, it cannot be
            retained or refunded
          </p>

          <span>Warm regards,</span>
          <br />
          <br />
          <h5>
            {SecheduleData.Society === "Dyanmic Land Management"
              ? "Dynamic Land Management"
              : "Property Bank"}
          </h5>
          {/*
          <h5>CEO</h5>
          <h5>DLM</h5>
          <h5>03160000000</h5> */}
        </div>
        {/* code is in schedule.css */}
        {/* <div className="foter-softxion">
          <h5>This site is created by  </h5>
          <div>
          <img src={softx } alt=""></img>
          <h3>Email:info@softxion.com</h3>
          </div> */}

        {/* </div> */}
      </div>
      {SecheduleData.Society === "Dyanmic Land Management" ? (
        <>
          <div className="a4Page">
            <h2>Terms and Conditions</h2>
            <ol>
              <li>
                I agree to pay the designated amount to the company's bank
                account by the 5th of every month. In the event of two
                consecutive late installments, I acknowledge that I will incur a
                fine for each late payment. Failure to pay three consecutive
                installments gives the company the right to cancel my plot, and
                neither I nor my heirs shall claim a refund of the paid amount
                or pursue any legal action.
              </li>
              <li>
                I agree to maintain the land in good condition during the
                installment period, ensuring no damage or unauthorized
                construction takes place. Any alterations or constructions made
                without prior approval from the company may result in penalties
                or cancellation of the agreement.
              </li>
              <li>
                The ownership of the land will remain with the company until the
                full payment is made, and the transfer of ownership will only
                occur upon completion of all installments and any applicable
                fees or charges.
              </li>
              <li>
                I understand that any changes to the terms of this agreement
                must be made in writing and mutually agreed upon by both
                parties. Verbal agreements or understandings hold no legal
                validity.
              </li>
              <li>
                In the event of any disputes or disagreements arising between
                the parties regarding this agreement, both parties agree to
                resolve them amicably through negotiation and mediation. If a
                resolution cannot be reached, either party may seek legal
                recourse.
              </li>
              <li>
                I agree to provide the company with updated contact information
                promptly if there are any changes during the term of this
                agreement to ensure effective communication regarding payments,
                updates, or any other matters related to the land.
              </li>
              <li>
                The company reserves the right to inspect the land periodically
                to ensure compliance with the terms of this agreement. I agree
                to provide access to the land for such inspections upon
                reasonable notice from the company.
              </li>
              <li>
                I acknowledge that the installment plan does not include any
                additional charges, such as utility connections, taxes, or
                transfer fees, unless explicitly stated in writing by the
                company. Any additional charges will be communicated to me in
                advance.
              </li>
              <li>
                I understand that this agreement is governed by the laws of
                [Jurisdiction], and any legal proceedings arising from or
                related to this agreement shall be brought exclusively in the
                courts of [Jurisdiction].
              </li>
            </ol>
            <p>
              These terms and conditions aim to provide clarity and protection
              for both parties involved in the agreement. Feel free to customize
              them further to meet your specific requirements and circumstances.
            </p>
          </div>
          <div className="a4Page">
            <div className="a4Img">
              <img src={dlmDiagram} alt="" />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Schedule;
