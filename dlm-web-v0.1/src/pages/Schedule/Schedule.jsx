import React from 'react'
import './schedule.css'
function Schedule() {
  return (
    <>
    <div className="schedule-main">
        <div className="schedule-head">
            <h2>Warm Greetings and Congratulations on Your Purchase!</h2>
            <div className="schedule-subject">
            <span>Dear: <strong>Ahmed Bhai</strong></span>
            </div>
            </div>
            <div className="schedule-desc">
            <p>On behalf of <strong>[Your Company Name]</strong>, we extend our heartfelt congratulations to you on the successful purchase of your plot/shop through our web portal. We are thrilled to have you as a valued member of our community, and we appreciate your trust in choosing us for your real estate investment.</p>
            <br />
            <p>This marks the beginning of an exciting journey for you, and we are committed to ensuring that your experience with us is nothing short of exceptional. Our team is here to assist you every step of the way, making your property ownership a seamless and enjoyable process.</p>
            <br />
            <p>As a token of our appreciation, please find attached your personalized installment schedule outlining the payment plan for your plot/shop. This schedule has been tailored to provide you with clarity and transparency, ensuring that you can plan your finances accordingly.</p>
            </div>
            <div className="table-head-schedule">
            <h5>Schedule:-</h5>
            
            </div>
            <div className="">
                <table className='invoice-table'>
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
                            <td>30,000 PKR</td>
                            <td>30,000 PKR</td>
                        </tr>
                        <tr>
                            <td>Down Payment</td>
                            <td>1</td>
                            <td>350,000 PKR</td>
                            <td>350,000 PKR</td>
                        </tr>
                        <tr>
                            <td>Installment/Month</td>
                            <td>60</td>
                            <td>6,666.6 PKR</td>
                            <td>400,000 PKR</td>
                        </tr>
                        <tr>
                            <td>Position Amount</td>
                            <td>1</td>
                            <td>350,000 PKR</td>
                            <td>350,000 PKR</td>
                        </tr>
                        <tr>
                            <td>Transfer</td>
                            <td>#</td>
                            <td>10,000 PKR</td>
                            <td>10,000 PKR</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th></th>
                            <th></th>
                            <th>Total Amount</th>
                            <th>1,140,000 PKR</th>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="schedule-desc-bottom">
                <p>Please review the schedule carefully, and if you have any questions or require further clarification, do not hesitate to reach out to our dedicated customer service team at [Customer Service Email/Phone Number]. We are here to assist you and ensure that your property ownership journey is as smooth as possible.</p>
                <br />
                <p>Once again, congratulations on your new investment! We look forward to building a lasting relationship with you and hope that your property brings you joy, prosperity, and countless memorable moments.</p>
                <br />
                <span>Warm regards,</span>
                <br />
                <h5>Salman</h5>
                <h5>Agent</h5>
                <h5>SoftXion</h5>
                <h5>03165545690</h5>
            </div>
        
    </div>
    </>
  )
}

export default Schedule