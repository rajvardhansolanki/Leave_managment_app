import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { getDateTime } from '../../../common/constant'
import {
  CButton,
  CForm,
  CFormGroup,
  CLabel,
  CInput,
  CCol,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CContainer,
  CTextarea
} from '@coreui/react'
import axios from 'axios'
import { getToken } from '../../storage/Local_Storage';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    primary: false
  }
  constructor(props) {
    super(props);
    this.state = {
      startdate: "",
      enddate: "",
      reason: ""
    };
    this.onInputchange = this.onInputchange.bind(this);
    this.onSubmitForm = this.onSubmitForm.bind(this);
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onSubmitForm(e) {
    e.preventDefault();
    var start = new Date(this.state.startdate);
    var end = new Date(this.state.enddate);

    var dateArry = [];
    // loop for every day start here
    for (var day = start; day <= end; day.setDate(day.getDate() + 1)) {
      var todayDate = new Date(day).toISOString().slice(0, 10);
      dateArry.push(todayDate);
    }
    // loop for every day end here

    // sunday muted code start here

    const dates = dateArry.map(dateArry => new Date(dateArry))
    const filteredDates = dates.filter(date => date.getDay() !== 0)
    const filteredDays = filteredDates.map(date => getDateTime(date))

    // sunday muted code end here

    // api code start here

    var token = getToken();
    axios
      .post('/api/leave-request/add', {
        datesToRequest: filteredDays,
        reason: this.state.reason
      }, {
        headers: {
          'authorization': token,
        }
      })
      .then(response => {
        console.log(response);
        toast.success('Submitted', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        this.setState({
          reason: ""
        });
      })
      .catch(error => {
        console.log(error);
      })

    this.setState(prevState => ({
      primary: !prevState.primary
    }))
  }

  // api code end here

  setCalenderState = () => {
    this.setState(prevState => ({
      primary: !prevState.primary
    }))
  }




  render() {
    const { reason } = this.state
    return (
      <>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
        {/* Full calander start here */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView='dayGridMonth'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          hiddenDays={[0]}
          selectAllow={this.dateAllow}
          weekends={this.sunday}
          initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          select={this.handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={this.handleEventClick}
          eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed

        />
        <CContainer>

          {/* Modal start here */}

          <CModal
            show={this.state.primary}
            onClose={this.setCalenderState}
            color="primary"
          >
            <CForm >
              <CModalHeader closeButton>
                <CModalTitle>Leave request</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <CRow>
                  <CCol md="12">
                    <CFormGroup>
                      <CLabel>Leave reason</CLabel>
                      <CTextarea id="leave" type="text" name="reason" value={reason} rows="1"
                        onChange={this.onInputchange} placeholder="" />
                    </CFormGroup>
                  </CCol>
                  <CCol md="12">
                    <CFormGroup>
                      <CLabel>Leave start date - to end date</CLabel>
                      <CInput id="" type="text" value={`${this.state.startdate} to ${this.state.enddate}`} placeholder="" disabled />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CModalBody>
              <CModalFooter>
                <CFormGroup>
                  <CButton color="secondary" onClick={this.setCalenderState}>
                    Cancle
                  </CButton>
                </CFormGroup>
                <CFormGroup>
                  <CButton color="primary" onClick={this.onSubmitForm}>
                    Submit
                  </CButton>
                </CFormGroup>
              </CModalFooter>
            </CForm>
          </CModal>

          {/* Modal end here */}
        </CContainer>
      </>
    )
  }

  dateAllow = (selectInfo) => {
    var date = moment(selectInfo.startStr).add(1, "day");

    return (
      moment().diff(date) <= 0
    )
  }

  handleDateSelect = (selectInfo) => {
    this.setState(
      this.setState(prevState => ({
        primary: !prevState.true
      }))
    )

    let title = this.state.reason

    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }


    const start_date = selectInfo.startStr;
    const End_date = moment(selectInfo.endStr).subtract(5, "hours");
    const end_date = moment(End_date).format("YYYY-MM-DD")

    this.setState(prevState => ({
      startdate: `${start_date}`,
      enddate: `${end_date}`
    }))
  }
  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}