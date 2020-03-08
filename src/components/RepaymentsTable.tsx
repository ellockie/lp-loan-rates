import React from 'react';
import { Table } from 'semantic-ui-react';
import './repaymentsTable.css';


export interface IRepayment {
    dateString: string;
    principal: number;
    interest: number;
    total: number;
}

interface IRepaymentsTableProps {
    repayments: IRepayment[];
}

type RepaymentField = 'principal' | 'interest' | 'total';


export const RepaymentsTable = (props: IRepaymentsTableProps): JSX.Element => {

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(amount);
    };
    const getColumnTotal = (fieldName: RepaymentField): number => {
        return props.repayments
            .reduce((sum: number, repayment: IRepayment) => sum + repayment[fieldName], 0);
    };
    const getPrincipalTotal = (): string => {
        return formatCurrency(getColumnTotal('principal'));
    };
    const getInterestTotal = (): string => {
        return formatCurrency(getColumnTotal('interest'));
    };
    const getTotal = (): string => {
        return formatCurrency(getColumnTotal('total'));
    };

    return (
        <Table celled striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Date</Table.HeaderCell>
                    <Table.HeaderCell>Principal</Table.HeaderCell>
                    <Table.HeaderCell>Interest</Table.HeaderCell>
                    <Table.HeaderCell>Total Repayment</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {props.repayments.map((repayment: IRepayment) => (
                    <Table.Row key={repayment.dateString}>
                        <Table.Cell className='date'>{repayment.dateString}</Table.Cell>
                        <Table.Cell>{formatCurrency(repayment.principal)}</Table.Cell>
                        <Table.Cell className='enlarge'>{formatCurrency(repayment.interest)}</Table.Cell>
                        <Table.Cell>{formatCurrency(repayment.total)}</Table.Cell>
                    </Table.Row>)
                )}
            </Table.Body>

            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell>{getPrincipalTotal()}</Table.HeaderCell>
                    <Table.HeaderCell>{getInterestTotal()}</Table.HeaderCell>
                    <Table.HeaderCell>{getTotal()}</Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    );
};