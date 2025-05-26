import {useState} from "react";
import './year.css';

function Year() {

    let now = new Date();
    let thisYear = now.getFullYear(); // 현재 년도 가져오기
    let [year, setYear] = useState(thisYear);

    return (
        <div className="container">
            <div className="year">
                <span className="left" onClick={() => {setYear(year - 1)}}>
                    {'< '}
                </span>
                <span>{year}</span>
                <span className="right" onClick={() => {setYear(year + 1)}}>
                    {' >'}
                </span>
            </div>
        </div>
    )
}
export default Year;