import React from 'react';
import 'devextreme/data/odata/store';
import DataGrid, {
  Column,
  Pager,
  Paging,
  FilterRow,
  Lookup,
  RemoteOperations
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
export default function Task() {
  return (
    <React.Fragment>
      <h2 className={'content-block'}>Tasks</h2>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={dataSource}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />

        <Column
            dataField={'id'}
            caption={'ID'}
            width={90}
            hidingPriority={2} />
        <Column
          dataField={'name'}
          width={190}
          caption={'Name'}
          hidingPriority={8}
        />
        <Column
          dataField={'email'}
          caption={'EMail'}
          hidingPriority={6}
        />
        {/*<Column*/}
        {/*  dataField={'email'}*/}
        {/*  caption={'Email'}*/}
        {/*  hidingPriority={5}*/}
        {/*>*/}
        {/*  <Lookup*/}
        {/*    dataSource={priorities}*/}
        {/*    valueExpr={'value'}*/}
        {/*    displayExpr={'name'}*/}
        {/*  />*/}
        {/*</Column>*/}
        {/*<Column*/}
        {/*  dataField={'ResponsibleEmployee.Employee_Full_Name'}*/}
        {/*  caption={'Assigned To'}*/}
        {/*  allowSorting={false}*/}
        {/*  hidingPriority={7}*/}
        {/*/>*/}
        <Column
          dataField={'createdOn'}
          caption={'Created On'}
          dataType={'date'}
          hidingPriority={3}
        />

        <Column
          dataField={'totalTransactionSum'}
          caption={'Transactions Sum'}
          name={'totalTransactionSum'}
          hidingPriority={1}
        />
      </DataGrid>
    </React.Fragment>
)}

// const dataSource = {
//   store: {
//     type: 'odata',
//     key: 'Task_ID',
//     url: 'https://js.devexpress.com/Demos/DevAV/odata/Tasks'
//   },
//   expand: 'ResponsibleEmployee',
//   select: [
//     'Task_ID',
//     'Task_Subject',
//     'Task_Start_Date',
//     'Task_Due_Date',
//     'Task_Status',
//     'Task_Priority',
//     'Task_Completion',
//     'ResponsibleEmployee/Employee_Full_Name'
//   ]
// };


const dataSource = new CustomStore({
  key: 'id',
  loadMode: 'raw', // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
  load: () => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
      // body: JSON.stringify({ title: 'React POST Request Example' })
    };

    return fetch('http://localhost:8080/api/v1/merchant/search', requestOptions)
        // .then(handleErrors)
        .then(response => response.json())
        .then(jsonResponse => jsonResponse.data)
        .catch(() => { throw 'Network error' })
  }
});

