import React , {useEffect ,useState} from 'react'
// intl messages
import axios from "axios";
import { DailyUsersAreaChart, WeeklyUsersAreaChart, MonthlyUsersAreaChart } from "../../../../../lib/vendor/Widget/SalesAreaChart";
import RctCollapsibleCard from "../../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import RecentOrdersWidget from "../../../../../lib/vendor/Widget/RecentOrders";
import BookingInfo from "../../../../../lib/vendor/Widget/BookingInfo";
import TodayOrdersStats from "../../../../../lib/vendor/Widget/TodayOrdersStats";



export default function EcommerceDashboard(props) {

    const token = localStorage.getItem('vendorToken');
    const [dailySales, setDailySales] = useState(0)
    const [monthlySales, setMonthlySales] = useState(0)
    const [weeklySales, setWeeklySales] = useState(0)
    
    useEffect(() => {
        axios.get('/vendor/sales-appointments', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                setDailySales(res.data.dailySales)
                setMonthlySales(res.data.monthlySale)
                setWeeklySales(res.data.weeklySales)

            })
    },[])
    

    return (
        <div className="ecom-dashboard-wrapper h-100">
            <title>Ecommerce Dashboard</title>
            <meta name="description" content="Reactify Ecommerce Dashboard" />
            <div className="row justify-content-center">
                <div className="col-sm-4 col-md-4 w-xs-full">
                    <DailyUsersAreaChart
                        data={dailySales}
                    />
                </div>
                <div className="col-sm-4 col-md-4 w-xs-full">
                    <WeeklyUsersAreaChart
                        data={weeklySales}
                    />
                </div>
                <div className="col-sm-4 col-md-4 w-xs-full">
                    <MonthlyUsersAreaChart
                        data={monthlySales}
                    />
                </div>
            </div>

            <div className="row justify-content-center">

                <div className={'col-md-6'}>

                    <RctCollapsibleCard
                        colClasses="col-sm-12 col-md-12 col-lg-12 "
                        heading={"Recent Appointments"}
                        collapsible
                        reloadable
                        closeable
                        fullBlock
                    >
                        <RecentOrdersWidget />
                    </RctCollapsibleCard>

                </div>
                <div className={'col-md-4'}>
                    <TodayOrdersStats />
                    <BookingInfo />

                </div>

            </div>

        </div>
    )
}