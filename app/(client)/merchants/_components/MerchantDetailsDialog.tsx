"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Eye,
  Building2,
  User,
  CreditCard,
  Building,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Hash,
  Camera,
  Download
} from 'lucide-react';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details: any | null;
  loading?: boolean;
}

const MerchantDetailsDialog = ({ open, onOpenChange, details, loading }: Props) => {
  const [activeTab, setActiveTab] = useState('business');

  const handleOpenChange = (state: any) => {
    setActiveTab('business');
    onOpenChange(state);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'onboarded': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <AlertCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'onboarded': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleDownload = async (fileUrl: string, name: string) => {
    const response = await fetch(fileUrl);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }

  const InfoCard = ({ icon: Icon, label, value, className = "" }: any) => {
    if (!value) return null;

    return (
      <div className={`bg-gray-50 rounded-lg p-4 border border-gray-100 hover:bg-gray-100 transition-colors ${className}`}>
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Icon className="h-4 w-4 text-gray-500" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-900 break-words capitalize">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const DocumentCard = ({ name, fileName }: any) => {
    if (!fileName) return null;

    return (
      <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors group cursor-pointer" onClick={() => window.open(fileName, '_blank')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
              {fileName.includes('.jpg') || fileName.includes('.png') ?
                <Camera className="h-4 w-4 text-blue-600" /> :
                <FileText className="h-4 w-4 text-blue-600" />
              }
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Eye className="h-4 w-4 mt-0.5 text-gray-400 group-hover:text-blue-600 transition-colors" onClick={() => window.open(fileName, '_blank')} />
            <Download className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" onClick={() => handleDownload(fileName, name)} />
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'business', label: 'Business Details', icon: Building2 },
    { id: 'personal', label: 'Personal Details', icon: User },
    { id: 'product', label: 'Product & Limits', icon: CreditCard },
    { id: 'bank', label: 'Bank Details', icon: Building },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  const renderBusinessTab = () => (
    <div className="space-y-6 mb-20">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={Building2} label="Legal Name" value={details.business?.legalName} />
        <InfoCard icon={Hash} label="Brand Name" value={details.business?.brandName} />
        <InfoCard icon={Building} label="Store Name" value={details.business?.storeName} />
        <InfoCard icon={FileText} label="Entity Type" value={details.businessEntityType?.split("_").join(" ").toUpperCase()} />
        <InfoCard icon={Hash} label="PAN Number" value={details.business?.pan} />
        <InfoCard icon={FileText} label="CIN/Registration" value={details.business?.registrationNumber} />
        <InfoCard icon={Hash} label="GSTIN" value={details.business?.gstin} />
        <InfoCard icon={Hash} label="MCC Code" value={details.business?.mcc} />
        <InfoCard icon={Calendar} label="Establishment Year" value={details.business?.establishmentYear} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={DollarSign} label="Annual Turnover" value={`${details.business?.turnoverAmount} (FY ${details.business?.turnoverFinancialYear})`} className="md:col-span-1" />
        <InfoCard icon={Building2} label="Nature of Business" value={details.business?.natureOfBusiness} className="md:col-span-1" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={Globe} label="Website" value={details.business?.websiteUrl} />
        <InfoCard icon={Phone} label="Registered Mobile" value={details.business?.registeredMobile} />
        <InfoCard icon={Mail} label="Registered Email" value={details.business?.registeredEmail} />
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Business Address
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon={MapPin} label="Address" value={details.business?.address} className="bg-white" />
          <InfoCard icon={MapPin} label="City" value={details.business?.city} className="bg-white" />
          <InfoCard icon={MapPin} label="State" value={details.business?.state} className="bg-white" />
          <InfoCard icon={Hash} label="PIN Code" value={details.business?.pinCode} className="bg-white" />
        </div>
      </div>
    </div>
  );

  const renderPersonalTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={User} label="Full Name" value={details.personal?.name} />
        <InfoCard icon={Phone} label="Mobile Number" value={details.personal?.mobile} />
        <InfoCard icon={Mail} label="Email Address" value={details.personal?.email} />
        <InfoCard icon={Hash} label="PAN Number" value={details.personal?.pan} />
        <InfoCard icon={FileText} label="KYC Document Type" value={details.personal?.kycDocumentType} />
        <InfoCard icon={Hash} label="KYC Document Number" value={details.personal?.kycDocumentNumber} />
      </div>

      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
        <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Personal Address
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon={MapPin} label="Address" value={details.personal?.address} className="bg-white" />
          <InfoCard icon={MapPin} label="City" value={details.personal?.city} className="bg-white" />
          <InfoCard icon={MapPin} label="State" value={details.personal?.state} className="bg-white" />
          <InfoCard icon={Hash} label="PIN Code" value={details.personal?.pinCode} className="bg-white" />
        </div>
      </div>
    </div>
  );

  const renderProductTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Product & Transaction Limits</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
          <h4 className="text-sm font-semibold text-purple-900 mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Product Details
          </h4>
          <InfoCard icon={CreditCard} label="Product Type" value={details.product?.productType} className="bg-white" />
        </div>

        <div className="bg-orange-50 rounded-lg p-6 border border-orange-100">
          <h4 className="text-sm font-semibold text-orange-900 mb-4 flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Transaction Limits
          </h4>
          <div className="space-y-3">
            <InfoCard icon={DollarSign} label="Daily Limit" value={details.product?.maxDaily} className="bg-white" />
            <InfoCard icon={DollarSign} label="Credit Limit" value={details.product?.creditLimit} className="bg-white" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard icon={DollarSign} label="Minimum per Transaction" value={details.product?.minPerTxn} />
        <InfoCard icon={DollarSign} label="Maximum per Transaction" value={details.product?.maxPerTxn} />
      </div>
    </div>
  );

  const renderBankTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Banking Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <InfoCard icon={Building} label="Account Type" value={details.bank?.accountType} />
        <InfoCard icon={User} label="Beneficiary Name" value={details.bank?.beneficiaryName} />
        <InfoCard icon={Hash} label="Account Number" value={details.bank?.accountNumber} />
        <InfoCard icon={Hash} label="IFSC Code" value={details.bank?.ifsc} />
        <InfoCard icon={Building} label="Bank Name" value={details.bank?.bankName} />
        <InfoCard icon={Building} label="Branch Name" value={details.bank?.branchName} />
      </div>

      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
        <h4 className="text-sm font-semibold text-indigo-900 mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Bank Branch Address
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoCard icon={MapPin} label="City" value={details.bank?.city} className="bg-white" />
          <InfoCard icon={MapPin} label="State" value={details.bank?.state} className="bg-white" />
          <InfoCard icon={Hash} label="PIN Code" value={details.bank?.bankPinCode} className="bg-white" />
          <InfoCard icon={MapPin} label="District" value={details.bank?.district} className="bg-white" />
        </div>
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6 mb-20">
      <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Business Documents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <DocumentCard name="Business PAN" fileName={details.kycDocs?.businessPan} />
            <InfoCard icon={Building2} label="Business Address Proof Type" value={(details.kycDocs?.businessAddressProofType || "").split("_").join(" ").toUpperCase()} />
            <DocumentCard name="Address Proof" fileName={details.kycDocs?.businessAddressProof} />
            <DocumentCard name="Signed MOA" fileName={details.kycDocs?.signedMoa} />
            <DocumentCard name="Signed AOA" fileName={details.kycDocs?.signedAoa} />
            <DocumentCard name="Registration Certificate" fileName={details.kycDocs?.registrationCertificate} />
            <DocumentCard name="GST Certificate" fileName={details.kycDocs?.gstRegistration} />
            <DocumentCard name="Business Licence" fileName={details.kycDocs?.businessLicence} />
            <DocumentCard name="Store Inside Photo" fileName={details.kycDocs?.storeInsideImage} />
            <DocumentCard name="Store Outside Photo" fileName={details.kycDocs?.storeOutsideImage} />
            <DocumentCard name="Board Resolution" fileName={details.kycDocs?.boardResolution} />
            <DocumentCard name="NSDL Declaration" fileName={details.kycDocs?.nsdlDeclaration} />
            <DocumentCard name="NSDL Declaration" fileName={details.kycDocs?.nsdlMaDeclaration} />
            <InfoCard icon={FileText} label="Have you filed your Income Tax Return?" value={(details.kycDocs?.itrFiled || "-")} />
            {details.kycDocs?.itrFiled === "YES"
              ? <DocumentCard name="ITR" fileName={details.kycDocs?.itrFile} />
              : <InfoCard icon={FileText} label="Reason for Not Filing ITR" value={(details.kycDocs?.itrReason || "-")} />
            }
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
            <User className="h-4 w-4" />
            Personal Documents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <DocumentCard name="Individual PAN" fileName={details.kycDocs?.individualPan} />
            <DocumentCard name="KYC Front" fileName={details.kycDocs?.kycFront} />
            <DocumentCard name="KYC Back" fileName={details.kycDocs?.kycBack} />
            <InfoCard icon={FileText} label="Individual Address Proof Type" value={(details.kycDocs?.individualAddressProofType || "").split("_").join(" ").toUpperCase()} />
            <DocumentCard name="Individual Address Proof" fileName={details.kycDocs?.individualAddressProof} />
            <DocumentCard name="Photo" fileName={details.kycDocs?.individualPhoto} />
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-700 mb-4 flex items-center gap-2">
            <Building className="h-4 w-4" />
            Banking Documents
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <InfoCard icon={Building} label="Bank Account Proof Type" value={(details.kycDocs?.bankAccountProofType || "").split("_").join(" ").toUpperCase()} />
            <DocumentCard name="Bank Account Proof" fileName={details.kycDocs?.bankAccountProof} />
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'business': return renderBusinessTab();
      case 'personal': return renderPersonalTab();
      case 'product': return renderProductTab();
      case 'bank': return renderBankTab();
      case 'documents': return renderDocumentsTab();
      default: return renderBusinessTab();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-screen h-full flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-200">
          <DialogTitle className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Merchant Details</h2>
                <p className="text-sm text-gray-500 font-normal">Complete merchant information</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 mr-10 rounded-full text-xs font-medium ${getStatusColor(details?.status)}`}>
              {getStatusIcon(details?.status)}
              {details?.status ? details.status.charAt(0).toUpperCase() + details.status.slice(1) : '—'}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* Sidebar Navigation */}
          <div className="w-64 flex-shrink-0 pr-6">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="pr-2">
              {loading ? (
                <div className="flex items-center justify-center py-10 text-sm text-gray-500">Loading...</div>
              ) : details ? (
                renderTabContent()
              ) : (
                <div className="flex items-center justify-center py-10 text-sm text-gray-500">No details available.</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MerchantDetailsDialog;