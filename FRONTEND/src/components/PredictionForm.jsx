import React, { useState , useEffect} from 'react';
import { User, DollarSign, Briefcase, Award, HelpCircle } from 'lucide-react';
import '../styles/prediction.css';

const emptyFormState = {
  Age: 35,
  Income: 65000,
  Education: 'High School',
  EmploymentType: 'Full-time',
  MaritalStatus: 'Single',
  HasDependents: 'No',

  LoanAmount: 25000,
  CreditScore: 710,
  MonthsEmployed: 42,
  NumCreditLines: 3,
  InterestRate: 9.5,
  LoanTerm: 36,
  DTIRatio: 0.32,

  LoanPurpose: 'Other',
  HasMortgage: 'No',
  HasCoSigner: 'No'
};


const numericFields = [
  'Age',
  'Income',
  'LoanAmount',
  'CreditScore',
  'MonthsEmployed',
  'NumCreditLines',
  'InterestRate',
  'LoanTerm',
  'DTIRatio'
];

const normalizeFormData = (data) => {
  const normalized = { ...data };

  numericFields.forEach((field) => {
    if (
      normalized[field] !== '' &&
      normalized[field] !== null &&
      normalized[field] !== undefined
    ) {
      normalized[field] = Number(normalized[field]);
    } else {
      normalized[field] = 0;
    }
  });

  // These fields belong to the dataset/API response,
  // not to the ML input.
  delete normalized.id;
  delete normalized.LoanID;
  delete normalized.Default;
  delete normalized.expectedOutcome;

  return normalized;
};

export default function PredictionForm({ onPredict, externalData }) {
  const [formData, setFormData] = useState(emptyFormState);
  const [errors, setErrors] = useState({});

  React.useEffect(() => {
  if (externalData) {
    setFormData({
      Age: externalData.Age ?? '',
      Income: externalData.Income ?? '',
      Education: externalData.Education ?? '',
      EmploymentType: externalData.EmploymentType ?? '',
      MaritalStatus: externalData.MaritalStatus ?? '',
      HasDependents: externalData.HasDependents ?? '',

      LoanAmount: externalData.LoanAmount ?? '',
      CreditScore: externalData.CreditScore ?? '',
      MonthsEmployed: externalData.MonthsEmployed ?? '',
      NumCreditLines: externalData.NumCreditLines ?? '',
      InterestRate: externalData.InterestRate ?? '',
      LoanTerm: externalData.LoanTerm ?? '',
      DTIRatio: externalData.DTIRatio ?? '',

      LoanPurpose: externalData.LoanPurpose ?? '',
      HasMortgage: externalData.HasMortgage ?? '',
      HasCoSigner: externalData.HasCoSigner ?? ''
    });

    setErrors({});
  }
}, [externalData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSegmentChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const loadPreset = (preset) => {
    setFormData(preset);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Age || formData.Age < 18 || formData.Age > 100) {
      newErrors.Age = "Age must be between 18 and 100.";
    }
    if (!formData.Income || formData.Income < 0) {
      newErrors.Income = "Income cannot be negative.";
    }
    if (!formData.LoanAmount || formData.LoanAmount <= 0) {
      newErrors.LoanAmount = "Loan amount must be greater than $0.";
    }
    if (!formData.CreditScore || formData.CreditScore < 300 || formData.CreditScore > 850) {
      newErrors.CreditScore = "Credit Score must be between 300 and 850.";
    }
    if (formData.DTIRatio < 0 || formData.DTIRatio > 1) {
      newErrors.DTIRatio = "DTI Ratio must be between 0.00 and 1.00 (e.g. 0.35).";
    }
    if (formData.InterestRate <= 0 || formData.InterestRate > 50) {
      newErrors.InterestRate = "Interest rate must be between 0.1% and 50%.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  if (validateForm()) {
    const normalizedData = normalizeFormData(formData);
    onPredict(normalizedData);
  }
};

  return (
   <form
  id="prediction-form"
  onSubmit={handleSubmit}
  className="prediction-form-wrapper"
>
      {/* Quick Preset Buttons */}

      {/* Card 1: Personal Information */}
      <div className="form-card-section">
        <h3 className="form-section-title">
          <User size={22} style={{ color: 'var(--primary-accent)' }} />
          Personal Information
        </h3>
        
        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">
              Age
              <span className="form-hint">(Years)</span>
            </label>
            <input
              type="number"
              name="Age"
              className={`form-control ${errors.Age ? 'error' : ''}`}
              value={formData.Age}
              onChange={handleChange}
              placeholder="e.g. 35"
              min="18"
              max="100"
            />
            {errors.Age && <div className="field-error-message">{errors.Age}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Annual Income ($)
              <span className="form-hint">(Gross)</span>
            </label>
            <input
              type="number"
              name="Income"
              className={`form-control ${errors.Income ? 'error' : ''}`}
              value={formData.Income}
              onChange={handleChange}
              placeholder="e.g. 65000"
              step="1000"
            />
            {errors.Income && <div className="field-error-message">{errors.Income}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Education Level</label>
            <select
              name="Education"
              className="form-control"
              value={formData.Education}
              onChange={handleChange}
            >
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor's Degree</option>
              <option value="Master's">Master's Degree</option>
              <option value="PhD">PhD / Doctorate</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select
              name="EmploymentType"
              className="form-control"
              value={formData.EmploymentType}
              onChange={handleChange}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Self-employed">Self-employed</option>
              <option value="Unemployed">Unemployed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Marital Status</label>
            <select
              name="MaritalStatus"
              className="form-control"
              value={formData.MaritalStatus}
              onChange={handleChange}
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Has Dependents</label>
            <div className="segmented-control">
              <button
                type="button"
                className={`segmented-option ${formData.HasDependents === 'Yes' ? 'selected' : ''}`}
                onClick={() => handleSegmentChange('HasDependents', 'Yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`segmented-option ${formData.HasDependents === 'No' ? 'selected' : ''}`}
                onClick={() => handleSegmentChange('HasDependents', 'No')}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Financial Information */}
      <div className="form-card-section">
        <h3 className="form-section-title">
          <DollarSign size={22} style={{ color: 'var(--secondary-accent)' }} />
          Financial Information
        </h3>

        <div className="form-grid-3">
          <div className="form-group">
            <label className="form-label">Requested Loan ($)</label>
            <input
              type="number"
              name="LoanAmount"
              className={`form-control ${errors.LoanAmount ? 'error' : ''}`}
              value={formData.LoanAmount}
              onChange={handleChange}
              placeholder="e.g. 25000"
              step="500"
            />
            {errors.LoanAmount && <div className="field-error-message">{errors.LoanAmount}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              Credit Score
              <span className="form-hint">(300 - 850)</span>
            </label>
            <input
              type="number"
              name="CreditScore"
              className={`form-control ${errors.CreditScore ? 'error' : ''}`}
              value={formData.CreditScore}
              onChange={handleChange}
              placeholder="e.g. 710"
              min="300"
              max="850"
            />
            {errors.CreditScore && <div className="field-error-message">{errors.CreditScore}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">
              DTI Ratio
              <span className="form-hint">(0.00 - 1.00)</span>
            </label>
            <input
              type="number"
              name="DTIRatio"
              className={`form-control ${errors.DTIRatio ? 'error' : ''}`}
              value={formData.DTIRatio}
              onChange={handleChange}
              placeholder="e.g. 0.32"
              step="0.01"
              min="0"
              max="1"
            />
            {errors.DTIRatio && <div className="field-error-message">{errors.DTIRatio}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Months Employed</label>
            <input
              type="number"
              name="MonthsEmployed"
              className="form-control"
              value={formData.MonthsEmployed}
              onChange={handleChange}
              placeholder="e.g. 42"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Number of Credit Lines</label>
            <input
              type="number"
              name="NumCreditLines"
              className="form-control"
              value={formData.NumCreditLines}
              onChange={handleChange}
              placeholder="e.g. 3"
              min="1"
              max="20"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Interest Rate (%)</label>
            <input
              type="number"
              name="InterestRate"
              className={`form-control ${errors.InterestRate ? 'error' : ''}`}
              value={formData.InterestRate}
              onChange={handleChange}
              placeholder="e.g. 9.5"
              step="0.1"
            />
            {errors.InterestRate && <div className="field-error-message">{errors.InterestRate}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Loan Term</label>
            <select
              name="LoanTerm"
              className="form-control"
              value={formData.LoanTerm}
              onChange={handleChange}
            >
              <option value="12">12 Months (1 Year)</option>
              <option value="24">24 Months (2 Years)</option>
              <option value="36">36 Months (3 Years)</option>
              <option value="48">48 Months (4 Years)</option>
              <option value="60">60 Months (5 Years)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card 3: Loan Details & Mitigators */}
      <div className="form-card-section">
        <h3 className="form-section-title">
          <Briefcase size={22} style={{ color: 'var(--primary-accent)' }} />
          Loan Details & Mitigators
        </h3>

        <div className="form-grid-3">
         <div className="form-group">
  <label className="form-label">Loan Purpose</label>
  <select
    name="LoanPurpose"
    className="form-control"
    value={formData.LoanPurpose}
    onChange={handleChange}
  >
    <option value="">Select Loan Purpose</option>
    <option value="Other">Other</option>
    <option value="Auto">Auto Loan</option>
    <option value="Business">Business</option>
    <option value="Home">Home</option>
    <option value="Education">Education</option>
  </select>
</div>

          <div className="form-group">
            <label className="form-label">Has Mortgage</label>
            <div className="segmented-control">
              <button
                type="button"
                className={`segmented-option ${formData.HasMortgage === 'Yes' ? 'selected' : ''}`}
                onClick={() => handleSegmentChange('HasMortgage', 'Yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`segmented-option ${formData.HasMortgage === 'No' ? 'selected' : ''}`}
                onClick={() => handleSegmentChange('HasMortgage', 'No')}
              >
                No
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Has Co-Signer</label>
            <div className="segmented-control">
              <button
                type="button"
                className={`segmented-option ${formData.HasCoSigner === 'Yes' ? 'selected' : ''}`}
                onClick={() => handleSegmentChange('HasCoSigner', 'Yes')}
              >
                Yes
              </button>
              <button
                type="button"
                className={`segmented-option ${formData.HasCoSigner === 'No' ? 'selected' : ''}`}
                onClick={() => handleSegmentChange('HasCoSigner', 'No')}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Action Buttons Bar */}
      <div className="form-actions-bar">
        <button type="submit" className="btn-predict-submit">
          <Award size={22} />
          Predict Loan Default Risk
        </button>
      </div>
    </form>
  );
}
