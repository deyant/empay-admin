import React, {useState} from 'react';
import 'devextreme/data/odata/store';
import DataSource from 'devextreme/data/data_source';
import DataGrid, {
  Column,
  ColumnChooser,
  ColumnChooserSearch,
  Editing,
  FilterRow,
  Lookup,
  Pager,
  Paging,
  StringLengthRule,
  RequiredRule,
  PatternRule
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import {EmailRule} from "devextreme-react/form";
import notify from "devextreme/ui/notify";

export default function Transaction() {
  return (
    <React.Fragment>
      <h2 className={'content-block'}>Transactions</h2>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={transactionsStore}
        showBorders={false}
        focusedRowEnabled={false}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        remoteOperations={true}
        cacheEnabled={false}
        syncLookupFilterValues={false}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <ColumnChooser enabled={true} mode="select">
          <ColumnChooserSearch enabled={true} />
        </ColumnChooser>
        <Editing
            mode="popup"
            allowUpdating={false}
            allowAdding={true}
            allowDeleting={false}
        ></Editing>

        <Column
            dataField={'id'}
            dataType="guid"
            caption={'ID'}
            allowEditing={false}
            hidingPriority={2} />
        <Column
            dataField={'typeId'}
            calculateDisplayValue={'type.name'}
            caption={'Type'}
            hidingPriority={5}
        >
          <RequiredRule />
          <Lookup dataSource={transactionTypeSource} valueExpr={'id'} displayExpr={'name'} />
        </Column>
        <Column
            dataField={'merchantId'}
            calculateDisplayValue={'merchantName'}
            dataType={`number`}
            caption={'Merchant'}
            // visible={}
            // showInColumnChooser={}
            hidingPriority={5}
        >
          <RequiredRule />
          <Lookup dataSource={merchantSource} valueExpr={'id'} displayExpr={'name'} />
        </Column>
        <Column
          dataField={'customerEmail'}
          dataType="string"
          caption={'Customer Email'}
          hidingPriority={8}
        >
          <StringLengthRule max={200} />
          <EmailRule/>
        </Column>
        <Column
          dataField={'customerPhone'}
          dataType="string"
          caption={'Customer Phone'}
          hidingPriority={6}
        >
          <StringLengthRule max={50} />
          <PatternRule pattern={'^[\\+]{0,1}[\\d]{1,}$'} />
        </Column>
        <Column
          dataField={'status.id'}
          calculateDisplayValue={'status.name'}
          caption={'Status'}
          allowEditing={false}
          hidingPriority={5}
        >
          <Lookup dataSource={transactionStatusTypeSource} valueExpr={'id'} displayExpr={'name'} />
        </Column>
        <Column
          dataField={'createdDate'}
          caption={'Created Date'}
          dataType={'datetime'}
          allowEditing={false}
          hidingPriority={3}
        />

        <Column
          dataField={'amount'}
          caption={'Amount'}
          name={'Amount'}
          hidingPriority={8}
        />
          <Column
              dataField={'belongsToTransactionId'}
              caption={'Belongs to transaction'}
              hidingPriority={1}
          />
          <Column
              dataField={'errorReason'}
              caption={'Error Reason'}
              allowEditing={false}
              hidingPriority={1}
          />
      </DataGrid>
    </React.Fragment>
)}

const isNotEmpty = (value) => value !== undefined && value !== null && value !== '';
function handleErrors(response) {
  if (!response.ok) {
      response.json().then(response => {
          let message = response.message;
          if (response.errors !== undefined) {
              message = "Validation failed with " + response.errors.length + " " + (response.errors.length == 1 ? "error" : "errors") + ":";
              response.errors.forEach((nextError) => {
                 message += "\n➡  " + nextError.defaultMessage;
              });
          }

          notify(
              {
                  message: message,
                  type: 'error',
                  displayTime: 20000,
                  closeOnClick: true
              }
          );
      });
  }
  return response;
}


const transactionsStore = new CustomStore({
  key: 'id',
  insert: (values) => {
    let requestOptions = {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(values)
    };

    return fetch('/api/v1/transaction', requestOptions)
        .then(handleErrors)
        .then(response => response.json())
        .then(response => {
          notify(
              {
                message: 'Transaction with ID "' + response.id + '" successfully created.',
                type: 'success',
                displayTime: 5000,
                closeOnClick: true
              }
          );
        })
        .catch((e) => {
          notify(
              {
                message: 'Error: ' + e,
                type: 'error',
                displayTime: 20000,
                closeOnClick: true
              }
          );
        })
  },
  update: (key, values) => {
    let requestOptions = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(values)
    };

    return fetch('/api/v1/transaction/' + key, requestOptions)
        .then(handleErrors)
        .then(response => response.json())
        .then(response => {
          notify(
              {
                message: 'Transaction with ID "' + response.id + '" successfully updated.',
                type: 'success',
                displayTime: 5000,
                closeOnClick: true
              }
          );
        })
        .catch((e) => {
          notify(
              {
                message: 'Error: ' + e,
                type: 'error',
                displayTime: 20000,
                closeOnClick: true
              }
          );
        });
  },
  remove: (key) => {
    let requestOptions = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'}
    };

    return fetch('/api/v1/transaction/' + key, requestOptions)
        .then(handleErrors)
        .then(response => {
          if (response.ok) {
            notify(
                {
                  message: 'Transactionse with ID "' + key + '" was deleted.',
                  type: 'success',
                  displayTime: 5000,
                  closeOnClick: true
                }
            );
          }
        })
        .catch((e) => {
          notify(
              {
                message: 'Error: ' + e,
                type: 'error',
                displayTime: 20000,
                closeOnClick: true
              }
          );
        })
  },
  load: (loadOptions) => {
    let searchCriteriaList = [];
    if (isNotEmpty(loadOptions.filter)) {
      if (Array.isArray(loadOptions.filter[0])) {
        loadOptions.filter.forEach(filter => {
          if (Array.isArray(filter)) {
            searchCriteriaList.push({
              filterKey: filter[0],
              operation: FILTER_OPERATIONS_MAP[filter[1]],
              value: filter[2]
            });
          } else {
            // do nothing
          }
        });
      } else {
        searchCriteriaList.push({
          filterKey: loadOptions.filter[0],
          operation: FILTER_OPERATIONS_MAP[loadOptions.filter[1]],
          value: loadOptions.filter[2]
        });
      }
    }

    let searchData = {
      searchCriteriaList : searchCriteriaList,
      dataOption: 'all'
    }

    if (isNotEmpty(loadOptions.sort)) {
      searchData.sort = loadOptions.sort[0].selector;
      searchData.ascending = !loadOptions.sort[0].desc;
    }

    let pageSize = 10;
    if (isNotEmpty(loadOptions.take)) {
      pageSize = loadOptions.take;
    }
    let pageNumber = 0;
    if (isNotEmpty(loadOptions.skip)) {
        pageNumber = loadOptions.skip / pageSize;
    }

    return fetch('/api/v1/transaction/search?pageNum=' + pageNumber + '&pageSize=' + pageSize, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData)
    }).then(handleErrors)
        .then(response => response.json())
        .then(response => {
          return {
            data: response.data,
            totalCount: response.totalElements,
            summary: response.summary,
            groupCount: response.groupCount
          };
        })
        .catch((e) => {
          console.log(e);
            notify(
                {
                    message: "Error: " + e,
                    type: 'error',
                    displayTime: 20000,
                    closeOnClick: true
                }
            );
        })
  }
});

const FILTER_OPERATIONS_MAP = {
  '<' : 'lt',
  '<=': 'le',
  '<>': 'ne',
  '=' : 'eq',
  '>' : 'gt',
  '>=': 'ge',
  'between' : 'bt',
  'contains' : 'cn',
  'endswith' : 'ew',
  'notcontains' : 'nc',
  'startswith' : 'bw'
}


const transactionTypeSource = new CustomStore({
  key: 'id',
  loadMode: 'raw', // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
  cacheRawData: false,
  load: () => {
    return fetch('/api/v1/transactionType')
        .then(handleErrors)
        .then(response => response.json())
        .then(response => {
          return response;
        })
        .catch((e) => {
          console.log(e);
            notify(
                {
                    message: "Error: " + e,
                    type: 'error',
                    displayTime: 20000,
                    closeOnClick: true
                }
            );
        })
  }
});


const transactionStatusTypeSource = new CustomStore({
  key: 'id',
  loadMode: 'raw',
  cacheRawData: false,
  load: () => {
    return fetch('/api/v1/transactionStatusType')
        .then(handleErrors)
        .then(response => response.json())
        .then(response => {
          return response;
        })
        .catch((e) => {
          console.log(e);
            notify(
                {
                    message: "Error: " + e,
                    type: 'error',
                    displayTime: 20000,
                    closeOnClick: true
                }
            );
        })
  }
});


const merchantStore = new CustomStore({
  key: 'id',
  cacheRawData: false,
  cacheData: false,
  byKey: (key) => {
    return fetch('/api/v1/merchant/' + key)
        .then(handleErrors)
        .then(response => response.json())
  },
  load: (loadOptions) => {
    let searchCriteriaList = [];
    if (isNotEmpty(loadOptions.searchExpr) && isNotEmpty(loadOptions.searchOperation) && isNotEmpty(loadOptions.searchValue)) {
        searchCriteriaList.push({
          filterKey: loadOptions.searchExpr,
          operation: FILTER_OPERATIONS_MAP[loadOptions.searchOperation],
          value: loadOptions.searchValue
        });
    }

    let searchData = {
      searchCriteriaList: searchCriteriaList,
      dataOption: 'all'
    }

    if (isNotEmpty(loadOptions.sort)) {
      searchData.sort = loadOptions.sort[0].selector;
      searchData.ascending = !loadOptions.sort[0].desc;
    }

    let pageSize = 10;
    if (isNotEmpty(loadOptions.take)) {
      pageSize = loadOptions.take;
    }
    let pageNumber = 0;
    if (isNotEmpty(loadOptions.skip)) {
      pageNumber = loadOptions.skip / pageSize;
    }

    return fetch('/api/v1/merchant/search?pageNum=' + pageNumber + '&pageSize=' + pageSize, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(searchData)
    })
        .then(handleErrors)
        .then(response => response.json())
        .then(response => {
          return {
            data: response.data,
            totalCount: response.totalElements,
            summary: response.summary,
            groupCount: response.groupCount
          };
        })
        .catch((e) => {
          console.log(e);
            notify(
                {
                    message: "Error: " + e,
                    type: 'error',
                    displayTime: 20000,
                    closeOnClick: true
                }
            );
        })
  }
});

const merchantSource = {
  store: merchantStore,
  key: "id",
  paginate: true,
  pageSize: 10
};

