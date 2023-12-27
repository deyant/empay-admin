import React from 'react';
import 'devextreme/data/odata/store';
import notify from 'devextreme/ui/notify';
import DataGrid, {
    Column,
    ColumnChooser,
    ColumnChooserSearch,
    Editing,
    FilterRow,
    Lookup,
    Pager,
    Paging,
    RequiredRule,
    StringLengthRule
} from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import {EmailRule} from "devextreme-react/form";

export default function Merchant() {
    return (
        <React.Fragment>
            <h2 className={'content-block'}>Merchants</h2>

            <DataGrid
                className={'dx-card wide-card'}
                dataSource={merchantDataSource}
                showBorders={false}
                focusedRowEnabled={false}
                defaultFocusedRowIndex={0}
                columnAutoWidth={true}
                columnHidingEnabled={true}
                remoteOperations={true}
                cacheEnabled={false}
                onRowUpdating={updateRow}
                syncLookupFilterValues={false}
                >
                <Paging defaultPageSize={10}/>
                <Pager showPageSizeSelector={true} showInfo={true}/>
                <FilterRow visible={true}/>
                <ColumnChooser enabled={true} mode="select">
                    <ColumnChooserSearch enabled={true}/>
                </ColumnChooser>
                <Editing
                    mode="popup"
                    allowUpdating={true}
                    allowAdding={true}
                    allowDeleting={true}
                ></Editing>

                <Column
                    dataField={'id'}
                    dataType="string"
                    caption={'ID'}
                    allowEditing={false}
                    hidingPriority={2}/>
                <Column
                    dataField={'name'}
                    dataType="string"
                    caption={'Name'}
                    hidingPriority={8}
                >
                    <StringLengthRule max={100}/>
                    <RequiredRule/>
                </Column>
                <Column
                    dataField={'email'}
                    dataType="string"
                    caption={'Email'}
                    hidingPriority={6}
                >
                    <StringLengthRule max={200}/>
                    <RequiredRule/>
                    <EmailRule/>
                </Column>
                <Column
                    dataField={'status.id'}
                    caption={'Status'}
                    hidingPriority={5}
                >
                    <Lookup dataSource={merchantStatusTypeSource} valueExpr={'id'} displayExpr={'name'}/>
                    <RequiredRule/>
                </Column>
                <Column
                    dataField={'totalTransactionSum'}
                    caption={'Transactions Sum'}
                    name={'totalTransactionSum'}
                    dataType={'number'}
                    hidingPriority={1}
                    allowEditing={false}
                />
                <Column
                    dataField={'identifierType.id'}
                    caption={'Identifier Type'}
                    hidingPriority={5}
                >
                    <Lookup dataSource={merchantIdentifierTypeSource} valueExpr={'id'} displayExpr={'name'}/>
                </Column>
                <Column
                    dataField={'identifierValue'}
                    dataType="string"
                    caption={'Identifier Value'}
                    hidingPriority={6}
                >
                    <StringLengthRule max={20}/>
                </Column>
                <Column
                    dataField={'createdDate'}
                    caption={'Created Date'}
                    dataType={'datetime'}
                    allowEditing={false}
                    hidingPriority={3}
                />
            </DataGrid>
        </React.Fragment>
    )
}

function updateRow(options) {
    let oldDataCopy = options.oldData;
    Object.keys(options.newData).forEach((key, index) => oldDataCopy[key] = options.newData[key]);
    options.newData = oldDataCopy;
}

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

const merchantDataSource = new CustomStore({
    key: 'id',
    insert: (values) => {
        return fetch('/api/v1/merchant', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
        }).then(handleErrors)
            .then(response => response.json())
            .then(response => {
                notify(
                    {
                        message: 'Merchant "' + response.name + '" with ID "' + response.id + '" successfully created.',
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
        return fetch('/api/v1/merchant/' + key, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(values)
        }).then(handleErrors)
            .then(response => response.json())
            .then(response => {
                notify(
                    {
                        message: 'Merchant "' + response.name + '" with ID "' + response.id + '" successfully updated.',
                        type: 'success',
                        displayTime: 5000,
                        closeOnClick: true
                    }
                );
            })
            .catch((e) => {
                console.log(e);
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
        return fetch('/api/v1/merchant/' + key, {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'}
        }).then(handleErrors)
            .then(response => {
                if (response.ok) {
                    notify(
                        {
                            message: 'Merchant with ID "' + key + '" was deleted.',
                            type: 'success',
                            displayTime: 5000,
                            closeOnClick: true
                        }
                    );
                }
            })
            .catch((e) => {
                console.log(e);
                notify(
                    {
                        message: 'Error: ' + e,
                        type: 'error',
                        displayTime: 5000,
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
        }).then(handleErrors)
            .then(response => response.json())
            .then(response => {
                return {
                    data: response.data,
                    totalCount: response.totalElements
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
    '<': 'lt',
    '<=': 'le',
    '<>': 'ne',
    '=': 'eq',
    '>': 'gt',
    '>=': 'ge',
    'between': 'bt',
    'contains': 'cn',
    'endswith': 'ew',
    'notcontains': 'nc',
    'startswith': 'bw'
}

const merchantStatusTypeSource = new CustomStore({
    key: 'id',
    loadMode: 'raw', // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
    cacheRawData: false,
    load: () => {
        return fetch('/api/v1/merchantStatusType')
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


const merchantIdentifierTypeSource = new CustomStore({
    key: 'id',
    loadMode: 'raw', // omit in the DataGrid, TreeList, PivotGrid, and Scheduler
    cacheRawData: false,
    load: () => {
        return fetch('/api/v1/merchantIdentifierType')
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


