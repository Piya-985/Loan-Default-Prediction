import React, { useState, useEffect } from 'react';
import { getSampleData } from '../services/predictionApi';
import {
  Database,
  ArrowRight,
  UserCheck,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const PAGE_SIZE = 10;

export default function SampleDataSection({ onSelectSample }) {
  const [sampleDataset, setSampleDataset] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const fetchSamples = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);

    try {
      const offset = (pageNumber - 1) * PAGE_SIZE;

      const data = await getSampleData(PAGE_SIZE, offset);

      setSampleDataset(data.samples || []);
      setTotalRecords(data.total || 0);
      setPage(pageNumber);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSamples(1);
  }, []);

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  const handlePrevious = () => {
    if (page > 1) {
      fetchSamples(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      fetchSamples(page + 1);
    }
  };

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
            <Database
              size={24}
              style={{ color: 'var(--primary-accent)' }}
            />

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

        <div
          style={{
            display: 'flex',
            gap: '10px',
            alignItems: 'center'
          }}
        >
          <button
            onClick={() => fetchSamples(page)}
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
            <RefreshCw
              size={14}
              className={loading ? 'spin' : ''}
            />

            Refresh Page
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
            {totalRecords.toLocaleString()} Dataset Records
          </span>
        </div>
      </div>

      {/* Loading */}
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
          {/* Sample cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {sampleDataset.map((item) => {
              let badgeBg = 'var(--risk-low-bg)';
              let badgeColor = 'var(--risk-low-text)';
              let BadgeIcon = UserCheck;

              if (item.expectedOutcome === 'Default') {
                badgeBg = 'var(--risk-high-bg)';
                badgeColor = 'var(--risk-high-text)';
                BadgeIcon = ShieldAlert;
              }

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
                        <strong>
                          ${Number(item.Income).toLocaleString()}
                        </strong>
                      </div>

                      <div>
                        Loan:{' '}
                        <strong>
                          ${Number(item.LoanAmount).toLocaleString()}
                        </strong>
                      </div>

                      <div>
                        Credit Score:{' '}
                        <strong>{item.CreditScore}</strong>
                      </div>

                      <div>
                        DTI Ratio:{' '}
                        <strong>
                          {(Number(item.DTIRatio) * 100).toFixed(0)}%
                        </strong>
                      </div>

                      <div>
                        Interest:{' '}
                        <strong>{item.InterestRate}%</strong>
                      </div>

                      <div>
                        Status:{' '}
                        <strong>{item.EmploymentType}</strong>
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

          {/* Pagination */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginTop: '28px',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={handlePrevious}
              disabled={page === 1 || loading}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-color)',
                background:
                  page === 1
                    ? 'var(--bg-secondary)'
                    : 'var(--bg-card)',
                color: 'var(--text-main)',
                cursor:
                  page === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <span
              style={{
                fontWeight: 700,
                color: 'var(--text-main)'
              }}
            >
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={page >= totalPages || loading}
              style={{
                padding: '8px 16px',
                borderRadius: 'var(--radius-pill)',
                border: '1px solid var(--border-color)',
                background:
                  page >= totalPages
                    ? 'var(--bg-secondary)'
                    : 'var(--bg-card)',
                color: 'var(--text-main)',
                cursor:
                  page >= totalPages
                    ? 'not-allowed'
                    : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}