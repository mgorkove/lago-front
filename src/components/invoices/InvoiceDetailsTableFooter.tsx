import { gql } from '@apollo/client'
import { memo } from 'react'
import styled from 'styled-components'

import { Alert, Skeleton, Typography } from '~/components/designSystem'
import { intlFormatNumber } from '~/core/formats/intlFormatNumber'
import { deserializeAmount } from '~/core/serializers/serializeAmount'
import { CurrencyEnum, Invoice, InvoiceStatusTypeEnum, InvoiceTypeEnum } from '~/generated/graphql'
import { useInternationalization } from '~/hooks/core/useInternationalization'
import { theme } from '~/styles'

gql`
  fragment InvoiceForDetailsTableFooter on Invoice {
    couponsAmountCents
    creditNotesAmountCents
    subTotalExcludingTaxesAmountCents
    subTotalIncludingTaxesAmountCents
    totalAmountCents
    currency
    prepaidCreditAmountCents
    versionNumber
    appliedTaxes {
      id
      amountCents
      tax {
        id
        name
        rate
      }
    }
  }
`

interface InvoiceDetailsTableFooterProps {
  invoice: Invoice
  loading: boolean
}

export const InvoiceDetailsTableFooter = memo(
  ({ invoice, loading }: InvoiceDetailsTableFooterProps) => {
    const { translate } = useInternationalization()
    const currency = invoice?.currency || CurrencyEnum.Usd
    const isLegacyInvoice = invoice?.versionNumber < 3

    return (
      <tfoot>
        {loading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <LoadingTR key={`invoice-details-table-footer-loading-${i}`}>
                <td></td>
                <td>
                  <Skeleton variant="text" height={12} width={160} />
                </td>
                <td>
                  <RightSkeleton variant="text" height={12} width={120} />
                </td>
              </LoadingTR>
            ))}
          </>
        ) : (
          <>
            {invoice.invoiceType !== InvoiceTypeEnum.Credit && (
              <>
                {invoice.status !== InvoiceStatusTypeEnum.Draft &&
                  !!Number(invoice?.couponsAmountCents) &&
                  !isLegacyInvoice && (
                    <tr>
                      <td></td>
                      <td>
                        <Typography variant="bodyHl" color="grey600">
                          {translate('text_637ccf8133d2c9a7d11ce705')}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body" color="success600">
                          -
                          {intlFormatNumber(
                            deserializeAmount(invoice?.couponsAmountCents || 0, currency),
                            {
                              currencyDisplay: 'symbol',
                              currency,
                            }
                          )}
                        </Typography>
                      </td>
                    </tr>
                  )}
                <tr>
                  <td></td>
                  <td>
                    <Typography variant="bodyHl" color="grey600">
                      {translate('text_637ccf8133d2c9a7d11ce6f9')}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body" color="grey700">
                      {intlFormatNumber(
                        deserializeAmount(
                          invoice?.subTotalExcludingTaxesAmountCents || 0,
                          currency
                        ),
                        {
                          currencyDisplay: 'symbol',
                          currency,
                        }
                      )}
                    </Typography>
                  </td>
                </tr>
                {!!invoice.appliedTaxes?.length ? (
                  <>
                    {invoice.appliedTaxes.map((appliedTax) => (
                      <tr key={`invoice-details-table-footer-tax-${appliedTax.id}`}>
                        <td></td>
                        <td>
                          <Typography variant="bodyHl" color="grey600">
                            {`${appliedTax.tax.name} (${intlFormatNumber(
                              appliedTax.tax.rate / 100 || 0,
                              {
                                maximumFractionDigits: 2,
                                style: 'percent',
                              }
                            )})`}
                          </Typography>
                        </td>
                        <td>
                          <Typography variant="body" color="grey700">
                            {intlFormatNumber(
                              deserializeAmount(appliedTax.amountCents || 0, currency),
                              {
                                currencyDisplay: 'symbol',
                                currency,
                              }
                            )}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td></td>
                    <td>
                      <Typography variant="bodyHl" color="grey600">
                        {`${translate('text_637ccf8133d2c9a7d11ce6fd')} (0%)`}
                      </Typography>
                    </td>
                    <td>
                      <Typography variant="body" color="grey700">
                        {intlFormatNumber(0, {
                          currencyDisplay: 'symbol',
                          currency,
                        })}
                      </Typography>
                    </td>
                  </tr>
                )}
                <tr>
                  <td></td>
                  <td>
                    <Typography variant="bodyHl" color="grey600">
                      {translate('text_637ccf8133d2c9a7d11ce701')}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body" color="grey700">
                      {intlFormatNumber(
                        deserializeAmount(
                          invoice?.subTotalIncludingTaxesAmountCents || 0,
                          currency
                        ),
                        {
                          currencyDisplay: 'symbol',
                          currency,
                        }
                      )}
                    </Typography>
                  </td>
                </tr>
              </>
            )}
            {!!Number(invoice?.creditNotesAmountCents) && (
              <tr>
                <td></td>
                <td>
                  <Typography variant="bodyHl" color="grey600">
                    {translate('text_637ccf8133d2c9a7d11ce708')}
                  </Typography>
                </td>
                <td>
                  <Typography variant="body" color="success600">
                    -
                    {intlFormatNumber(
                      deserializeAmount(invoice?.creditNotesAmountCents || 0, currency),
                      {
                        currencyDisplay: 'symbol',
                        currency,
                      }
                    )}
                  </Typography>
                </td>
              </tr>
            )}
            {invoice.status !== InvoiceStatusTypeEnum.Draft &&
              !!Number(invoice?.couponsAmountCents) &&
              !!isLegacyInvoice && (
                <tr>
                  <td></td>
                  <td>
                    <Typography variant="bodyHl" color="grey600">
                      {translate('text_637ccf8133d2c9a7d11ce705')}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body" color="success600">
                      -
                      {intlFormatNumber(
                        deserializeAmount(invoice?.couponsAmountCents || 0, currency),
                        {
                          currencyDisplay: 'symbol',
                          currency,
                        }
                      )}
                    </Typography>
                  </td>
                </tr>
              )}
            {invoice.status !== InvoiceStatusTypeEnum.Draft &&
              !!Number(invoice?.prepaidCreditAmountCents) && (
                <tr>
                  <td></td>
                  <td>
                    <Typography variant="bodyHl" color="grey600">
                      {translate('text_6391f05df4bf96d81f3660a7')}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body" color="success600">
                      -
                      {intlFormatNumber(
                        deserializeAmount(invoice?.prepaidCreditAmountCents || 0, currency),
                        {
                          currencyDisplay: 'symbol',
                          currency,
                        }
                      )}
                    </Typography>
                  </td>
                </tr>
              )}
            <tr>
              <td></td>
              <td>
                <Typography variant="bodyHl" color="grey700">
                  {invoice.invoiceType === InvoiceTypeEnum.Credit
                    ? translate('text_63887b52e514213fed57fc1c')
                    : translate('text_637ccf8133d2c9a7d11ce70d')}
                </Typography>
              </td>
              <td>
                <Typography variant="body" color="grey700">
                  {intlFormatNumber(deserializeAmount(invoice?.totalAmountCents || 0, currency), {
                    currencyDisplay: 'symbol',
                    currency,
                  })}
                </Typography>
              </td>
            </tr>
            {invoice.status === InvoiceStatusTypeEnum.Draft && (
              <tr>
                <td></td>
                <NoShadowTD colSpan={2}>
                  <Alert type="info">{translate('text_63b6f4e9b074e3b8beebb97f')}</Alert>
                </NoShadowTD>
              </tr>
            )}
          </>
        )}
      </tfoot>
    )
  }
)

const RightSkeleton = styled(Skeleton)`
  float: right;
`
const LoadingTR = styled.tr`
  > td {
    padding: ${theme.spacing(3)} 0;
  }
`

const NoShadowTD = styled.td`
  box-shadow: none !important;
`

InvoiceDetailsTableFooter.displayName = 'InvoiceDetailsTableFooter'
