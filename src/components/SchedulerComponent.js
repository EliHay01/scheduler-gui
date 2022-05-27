import React from 'react';

import { Inject, Resize, DragAndDrop, ScheduleComponent, Day, Week, WorkWeek, Month } from '@syncfusion/ej2-react-schedule';
import { DataManager, WebMethodAdaptor, WebApiAdaptor, UrlAdaptor} from '@syncfusion/ej2-data';
import {Internationalization} from '@syncfusion/ej2-base'
import authHeader from '../services/auth.header';

import './SchedulerComponent.css';
//let myHeaders = ''

function SchedulerComponent (props) {
  //const header = authHeader;

  const remoteData = new DataManager({
    url: 'https://localhost:49157/api/Scheduler/LoadData', // 'controller/actions'
    crudUrl: 'https://localhost:49157/api/Scheduler/UpdateData',
    adaptor: new UrlAdaptor(),
    headers: [authHeader()]
    });


  const getTimeString = (value) => {
    var instance = new Internationalization();
    return instance.formatDate(value, { skeleton: 'hm' });
  };
  var scheduleObj

  const eventTemplate = (model) => {
    //debugger;
    return (
      <div>
        <div className="template-wrap-data">{model.Owner}</div>
        <div className="template-wrap-title">{model.Subject}</div>
        <div className="template-wrap-data">
          {getTimeString(model.StartTime)} - {getTimeString(model.EndTime)}
        </div>
      </div>
    );
  };
  const onActionBegin = (args) => {
    if (
      args.requestType === 'eventCreate' ||
      args.requestType === 'eventChange'
    ) {
      let data = args.data instanceof Array ? args.data[0] : args.data;
      if (!scheduleObj.isSlotAvailable(data.StartTime, data.EndTime)) {
        args.cancel = true;
      }
    }
    if ( args.requestType === 'eventCreate' ){
      let data = args.data instanceof Array ? args.data[0] : args.data;
      data.Id = "1"
    }
  }

  const onEventRendered = (args) => {
    switch (args.data.Owner) {
      case 'Eli Hay':
        args.element.style.backgroundColor = '#F57F17';
        break;
      case '':
        args.element.style.backgroundColor = '#7fa900';
        break;
      case 'New':
        args.element.style.backgroundColor = '#8e24aa';
        break;
    }
  }
  


  return (
    <ScheduleComponent 
      selectedDate={new Date()}
      eventSettings={{ 
        dataSource: remoteData,
        template: eventTemplate,
        }}
      actionBegin={onActionBegin.bind(this)}
      eventRendered={onEventRendered.bind(this)}
      ref={schedule => (scheduleObj = schedule)}
    >
      <Inject services={[Day, Week, WorkWeek, Month, Resize, DragAndDrop]}/>
    </ScheduleComponent>
  )
}

export default SchedulerComponent;