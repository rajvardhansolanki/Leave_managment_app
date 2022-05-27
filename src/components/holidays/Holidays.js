import React from 'react'
import { CCol, CRow, CWidgetIcon } from '@coreui/react'
import CIcon from '@coreui/icons-react'

const leaves = [
    { id: 1, date: "22nd Aug 2021", festival: "Raksha Bandhan" },
    { id: 2, date: "15th Aug 2021", festival: "Independence Day" },
    { id: 3, date: "2nd Oct 2021", festival: "Gandhi Jayanti" },
    { id: 4, date: "4th Nov 2021", festival: "Diwali" },
    { id: 5, date: "5th Nov 2021", festival: "Diwali" },
    { id: 6, date: "1st Jan 2022", festival: "New Year" },
    { id: 7, date: "26th Jan 2022", festival: "Republic Day" },
    { id: 8, date: "19th March 2022", festival: "Holi" },
    { id: 9, date: "22nd March 2022", festival: "Rangpanchami" }
];

const Widgets = () => {
    return (
        <>
            <h1>Welcome Admin!</h1>
            <h3 className="my-3">Employees / Holidays</h3>
            {/* Employees Holidays Section */}
            <CRow>
                {
                    leaves.map((leave, index) => <CCol sm="12" md="6" key={index}> <CWidgetIcon text={leave.festival} header={leave.date} color="primary">
                        <CIcon width={24} name="cil-mood-very-good" />
                    </CWidgetIcon>
                    </CCol>
                    )
                }
            </CRow>
        </>
    )
}

export default Widgets
