/**
 * Recent Orders
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios'

// api

//badge-info Sea green
//"badge-success": 'green,
//"badge-danger": 'red',


function RecentOrders() {


   const [resentAppointments, ResentSetAppointments] = useState([])
   const token = localStorage.getItem('vendorToken');

   useEffect(() => {
      axios.get('/vendor/recent-appointments', { headers: { "Authorization": `Bearer ${token}` } })
         .then((res) => {
            console.log(res.data)
            ResentSetAppointments(res.data)
         })
   }, [])


   return (
      <div className="table-responsive">
         <table className="table table-hover mb-0">
            <thead>
               <tr>
                  <th>Customer Name</th>
                  <th>Employee</th>
                  <th>Profitment</th>
                  <th>Status</th>
               </tr>
            </thead>
            <tbody>
               {resentAppointments && resentAppointments.map((order, key) => {

                  let status;

                  if (order.status === "COMPLETED") {
                     status = <span style={{ fontWeight: "bold", color: "green" }}>{order.status}</span>
                  }
                  if(order.status === "PENDING"){
                     status = <span style={{ fontWeight: "bold", color: "yellow" }}>{order.status}</span>
                  }
                  if(order.status === "CANCELLED"){
                     status = <span style={{ fontWeight: "bold", color: "red" }}>{order.status}</span>
                  }


                  return (
                     <tr key={key}>
                        <td>{order.customerName}</td>
                        <td>
                           <span className="d-block fw-normal">{order.title}</span>
                           <span className="fs-12">{order.customerEmail}</span>
                        </td>
                        <td>Aed {order.totalPrice}</td>
                        <td>
                           {
                              status
                           }
                        </td>
                     </tr>
                  )
               })}
            </tbody>
         </table>
      </div>
   );
}

export default RecentOrders;
