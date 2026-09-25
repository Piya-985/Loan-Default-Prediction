import React, { useState, useEffect } from 'react';
import { getSampleData } from '../services/predictionApi';
import {
  Database,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const TOTAL_RECORDS = 10;
const PAGE_SIZE = 5;

export default function SampleDataSection({ onSelectSample }) {
  const [allRecords, setAllRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Only 2 pages: 1 (records 1-5) and 2 (records 6-10)
  const [page, setPage] = useState(1);

  const fetchSamples = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch exactly 10 records from the beginning of the dataset
      const data = await getSampleData(TOTAL_RECORDS, 0);
      // Enforce max 10 records regardless of API response
      setAllRecords((data.samples || []).slice(0, TOTAL_RECORDS));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples();
  }, []);

  // Client-side slicing: page 1 = indices 0-4, page 2 = indices 5-9
  const startIndex = (page - 1) * PAGE_SIZE;
  const visibleRecords = allRecords.slice(startIndex, startIndex + PAGE_SIZE);

  const isFirstPage = page === 1;
  const isLastPage = page === 2;

  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '36px',
        marginBottom: '40px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h3
            style={{
              fontSize: '1.4rem',
              fontWeight: 800,
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <Database size={24} style={{ color: 'var(--primary-accent)' }} />
            ML Project Sample Dataset Records
          </h3>
          <p
            style={{
              fontSize: '0.9rem',
              color: 'var(--text-sub)',
              marginTop: '4px'
            }}
          >
            Real borrower records loaded directly from{' '}
            <code>Loan_default.csv</code>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => {
              setPage(1);
              fetchSamples();
            }}
            disabled={loading}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--primary-accent)',
              border: 'none',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} />
            Refresh
          </button>

          <span
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--text-sub)'
            }}
          >
            {TOTAL_RECORDS} Sample Records
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div
          style={{
            padding: '40px',
            textAlign: 'center',
            color: 'var(--text-sub)'
          }}
        >
          Loading samples from Loan_default.csv...
        </div>
      ) : error ? (
        <div
          style={{
            padding: '20px',
            textAlign: 'center',
            color: 'var(--risk-high-text)',
            background: 'var(--risk-high-bg)',
            borderRadius: '8px'
          }}
        >
          Error loading samples: {error}
        </div>
      ) : (
        <>
          {/* 5 record cards for the current page */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {visibleRecords.map((item) => {
              const isDefault = item.expectedOutcome === 'Default';
              const badgeBg = isDefault
                ? 'var(--risk-high-bg)'
                : 'var(--risk-low-bg)';
              const badgeColor = isDefault
                ? 'var(--risk-high-text)'
                : 'var(--risk-low-text)';
              const BadgeIcon = isDefault ? ShieldAlert : UserCheck;

              return (
                <div
                  key={item.LoanID}
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '16px',
                    transition: 'all var(--transition-smooth)'
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '8px'
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: 'var(--text-light)',
                          letterSpacing: '0.05em'
                        }}
                      >
                        {item.LoanID}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '4px',
                          background: badgeBg,
                          color: badgeColor,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <BadgeIcon size={12} />
                        {item.expectedOutcome}
                      </span>
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: '1rem',
                        color: 'var(--text-main)',
                        marginBottom: '12px'
                      }}
                    >
                      Borrower Record
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        fontSize: '0.82rem',
                        color: 'var(--text-sub)'
                      }}
                    >
                      <div>
                        Income:{' '}
                        <strong>${Number(item.Income).toLocaleString()}</strong>
                      </div>
                      <div>
                        Loan:{' '}
                        <strong>
                          ${Number(item.LoanAmount).toLocaleString()}
                        </strong>
                      </div>
                      <div>
                        Credit Score: <strong>{item.CreditScore}</strong>
                      </div>
                      <div>
                        DTI Ratio:{' '}
                        <strong>
                          {(Number(item.DTIRatio) * 100).toFixed(0)}%
                        </strong>
                      </div>
                      <div>
                        Interest: <strong>{item.InterestRate}%</strong>
                      </div>
                      <div>
                        Status: <strong>{item.EmploymentType}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Test button */}
                  <button
                    type="button"
                    onClick={() => onSelectSample(item)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-pill)',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-main)',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Test Sample in Predictor
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>

          {/*
            Arrow pagination:
            - Page 1: only right arrow (→) visible, left arrow hidden
            - Page 2: only left arrow (←) visible, right arrow hidden
            - No numbered pagination, no URL navigation
          */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '28px',
              minHeight: '44px'
            }}
          >
            {/* Left arrow — shown only on page 2 */}
            {!isFirstPage ? (
              <button
                type="button"
                onClick={() => setPage(1)}
                aria-label="Previous 5 records"
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <ChevronLeft size={18} />
                Previous
              </button>
            ) : (
              // Invisible placeholder so the right arrow stays right-aligned
              <div />
            )}

            {/* Right arrow — shown only on page 1 */}
            {!isLastPage ? (
              <button
                type="button"
                onClick={() => setPage(2)}
                aria-label="Next 5 records"
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all var(--transition-fast)'
                }}
              >
                Next
                <ChevronRight size={18} />
              </button>
            ) : (
              // Invisible placeholder so the left arrow stays left-aligned
              <div />
            )}
          </div>
        </>
      )}
    </div>
  );
}