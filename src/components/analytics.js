import { useState, useEffect } from "react"
import axios from "axios"
import "../styles/analytics.css"
import { addAnalyticsData } from "../reducers/analyticsDataReducer"
import { addAppData } from "../reducers/appDataReducer"
import { useSelector, useDispatch } from "react-redux"
import { message } from "antd"

export default function Analytics() {
    const dispatch = useDispatch()
    const storedAnalyticsData = useSelector((state) => { return state.analytics })
    const storedAppData = useSelector((state) => { return state.appData })

    {/*Below hook is used to store the temporary data and it'll help us while filtration */ }
    const [renderedAnalyticsData, setRenderedAnalyticsData] = useState([])
    {/*below hook is used to store the total data */ }
    const [analyticsData, setAnalyticsData] = useState([])
    {/*Below hooks is used to store the app and their id's */ }
    const [appData, setAppData] = useState([])
    {/*Below hook is used to store all the columns of tha table */ }
    const [columns, setColumns] = useState({})
    {/*Below hook is used to store the columns of table and is used at the time of reordering of table columns */ }
    const [columnsOrder, setColumnsOrder] = useState([])
    {/*below variable shows the extra columns which we need to show in the table apart from the data fetched from api */ }
    const extra_columns = ["app", "fill_rate", "CTR"]

    useEffect(() => {
        async function loadData() {
            try {
                if (storedAnalyticsData.length > 0) {
                    addColumnsToAnalytics(storedAnalyticsData[0])
                }
                else {
                    let resAnalyticsData = await axios.get("https://go-dev.greedygame.com/v3/dummy/report?startDate=2021-06-01&endDate=2021-06-30")
                    console.log(resAnalyticsData.data.data)
                    dispatch(addAnalyticsData(resAnalyticsData.data.data))
                    addColumnsToAnalytics(resAnalyticsData.data.data)
                }

            }
            catch (err) {
                console.log("ERROR:", err)
            }
        }
        loadData()
    }, [])

    {/*Below function is to hide columns based on the column name*/ }
    const hideColumn = (event, colName) => {
        let columnData = { ...columns };
        columnData[colName]["hidden"] = !columnData[colName]["hidden"]
        if (columnData[colName]["hidden"]) {
            event.target.parentNode.parentNode.style.borderLeft = "5px solid blue"
        }
        else {
            event.target.parentNode.parentNode.style.borderLeft = "1px solid black"
        }
        setColumns(columnData)
    }

    {/*Below function is used to sort the table based on columns previous state */ }
    const sortByColumn = (event) => {
        const columnName = event.target.nextElementSibling.innerHTML;
        let tableData = JSON.parse(JSON.stringify(analyticsData))
        let columnData = { ...columns };
        if (columnData[columnName]["ascend"]) {
            event.target.innerHTML = "&#8595;";
            if (typeof (tableData[0][columnName]) == "string") {
                tableData.sort((a, b) => {
                    const nameA = a[columnName].toUpperCase();
                    const nameB = b[columnName].toUpperCase();
                    if (nameA > nameB) {
                        return -1;
                    }
                    if (nameA < nameB) {
                        return 1;
                    }
                    return 0;
                });
            }
            else {
                tableData.sort((a, b) => b[columnName] - a[columnName])
            }
        }
        else {
            event.target.innerHTML = "&#8593;";
            if (typeof (tableData[0][columnName]) == "string") {
                tableData.sort((a, b) => {
                    const nameA = a[columnName].toUpperCase();
                    const nameB = b[columnName].toUpperCase();
                    if (nameA > nameB) {
                        return 1;
                    }
                    if (nameA < nameB) {
                        return -1;
                    }
                    return 0;
                });
            }
            else {
                tableData.sort((a, b) => a[columnName] - b[columnName])
            }
        }
        setAnalyticsData(tableData)
        setRenderedAnalyticsData(tableData)
        columnData[columnName]["ascend"] = !columnData[columnName]["ascend"]
    }

    {/*below function is to fetch data from api*/ }
    const addColumnsToAnalytics = async (tempAnalyticsData) => {
        /*below functionality is for mapping id's with app names*/
        let res = {}
        if (storedAppData.length > 0) {
            res = {}
            storedAppData[0].map((app) => {
                res[app["app_id"]] = app["app_name"]
            })
            setAppData(storedAppData[0])
        }
        else {
            let resAppData = await axios.get("https://go-dev.greedygame.com/v3/dummy/apps")
            console.log(resAppData.data.data)
            res = {}
            resAppData.data.data.map((app) => {
                res[app["app_id"]] = app["app_name"]
            })
            dispatch(addAppData(resAppData.data.data))
            setAppData(res)
        }

        /*below functionality is to add new columns to analytics data and set analytics data to hooks*/
        let data = []
        tempAnalyticsData.map((companyReport) => {
            let tempCompanyReport = { ...companyReport }
            tempCompanyReport[extra_columns[0]] = res[companyReport["app_id"]]
            tempCompanyReport[extra_columns[1]] = ((companyReport["requests"] / companyReport["responses"]) * 100).toFixed(2)
            tempCompanyReport[extra_columns[2]] = ((companyReport["clicks"] / companyReport["impressions"]) * 100).toFixed(2)
            data.push(tempCompanyReport)
        })
        setColumnsData(data[0])
        setAnalyticsData(data)
        setRenderedAnalyticsData(data)

    }

    const modifyAppData = (appData) => {

    }

    {/*Below function is to store all the columns and it'll be useful while we need to reorder the columns */ }
    const setColumnsData = (companyReport) => {
        let res = {}
        let colOrder = []
        Object.keys(companyReport).map((key, i) => {
            res[key] = { "id": i, "hidden": false, "ascend": false }
            if (key != "app_id") {
                colOrder.push(key)
            }
        })

        setColumnsOrder(colOrder)
        console.log(res)
        setColumns(res)
    }

    {/*Below function is to show the date format in an understandable way */ }
    const formatDate = (dateString) => {
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let date = new Date(Date.parse(dateString))
        return date.getDate() + " " + month[date.getMonth()] + "," + date.getFullYear();
    }

    {/*Below function is used to reorder any two columns of the table*/ }
    const reOrder = () => {
        const from = document.getElementById("from").value
        const to = document.getElementById("to").value
        if (from < 0 || to > columnsOrder.length) {
            message.warning("column numbers are out of bounds")
        }
        else {
            let tempColumnsOrder = [...columnsOrder]
            let temp = tempColumnsOrder[from]
            tempColumnsOrder[from] = tempColumnsOrder[to]
            tempColumnsOrder[to] = temp
            setColumnsOrder(tempColumnsOrder)
        }
    }

    {/*Below function is used to filter the table data by app name */ }
    const searchByAppName = (event) => {
        const term = event.target.value.toLowerCase()
        let filteredData = []
        analyticsData.map((companyReport) => {
            if (companyReport["app"].toLowerCase().includes(term)) {
                filteredData.push(companyReport)
            }
        })
        setRenderedAnalyticsData(filteredData)
    }

    return (
        <>
            <div className="p-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium mb-5">Analytics</h1>
                    <input className="border-1 border-black rounded-lg mr-3 ml-3 p-2" type="text" placeholder="Search By App name" onKeyUp={(event) => searchByAppName(event)} />
                </div>
                {/*JSON.stringify(columnsOrder)*/}
                <h1 className="text-xl font-medium mb-5">Reorder Columns</h1>
                <i>Enter the column numbers of columns which you want to reorder. <br /><span><b>Hint</b> : column number starts with 0</span></i>
                <div className="flex items-center space-x-5 mt-5">
                    Column Number : <input className="border-1 border-black mr-3 ml-3" type="number" id="from" />
                    Column Number : <input className="border-1 border-black ml-3 mr-3" type="number" id="to" />
                    <button onClick={reOrder} className="border-1 border-black p-3 pt-2 pb-2">Reorder</button>
                </div>
                <div className="flex items-center flex-wrap space-x-5 mt-5">{

                    columnsOrder.map((columnName) => {
                        if (columnName != "app_id")
                            return <div className="border-1 rounded-md border-black p-3 pt-2 pb-2 mb-3"><span className="cursor-pointer" onClick={(event) => { sortByColumn(event) }}>&#8693;</span> <span>{columnName}</span> <span className="cursor-pointer border-1 border-black rounded-md p-2 pt-1 pb-1" onClick={(event) => hideColumn(event, columnName)}>{columns[columnName]["hidden"] ? <span>show</span> : <span>hide</span>}</span></div>
                    })}
                </div>

                <table>
                    {
                        renderedAnalyticsData.map((companyReport) => {
                            return <tr>
                                {
                                    columnsOrder.map((column) => {
                                        {

                                            if (!columns[column]["hidden"]) {
                                                if (column == "date") {
                                                    return <td>{formatDate(companyReport[column])}</td>
                                                }
                                                if (column == "app_id") {
                                                    return <></>
                                                }
                                                if (column == "revenue" && companyReport[column]) {
                                                    return <td>{companyReport[column].toFixed(2)}</td>
                                                }
                                                return <td>{companyReport[column]}</td>
                                            }
                                            else {
                                                return <td></td>
                                            }
                                        }
                                    })
                                }
                            </tr>
                        })
                    }
                </table>
            </div>
        </>
    )
}