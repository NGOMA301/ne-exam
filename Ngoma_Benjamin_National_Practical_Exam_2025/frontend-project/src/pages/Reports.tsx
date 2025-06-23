import React, { useState } from 'react';
import { Calendar, Download, BarChart3, TrendingUp } from 'lucide-react';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import { paymentService, DailyReport } from '../services/paymentService';

const Reports: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateReport = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const reportData = await paymentService.getDailyReport(selectedDate);
      setReport(reportData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate report');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!report) return;

    const csvContent = [
      'Plate Number,Package Name,Package Description,Amount Paid,Payment Date',
      ...report.data.map(item => 
        `${item.plateNumber},"${item.packageName}","${item.packageDescription}",${item.amountPaid},${new Date(item.paymentDate).toLocaleDateString()}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `daily-report-${selectedDate}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalRevenue = report ? report.data.reduce((sum, item) => sum + item.amountPaid, 0) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        <p className="text-gray-600 mt-2">Generate and download daily revenue reports</p>
      </div>

      {/* Report Generator */}
      <Card title="Daily Revenue Report" subtitle="Generate a report for a specific date">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                label="Select Date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleGenerateReport}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {loading ? 'Generating...' : 'Generate Report'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Report Results */}
      {report && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Services</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{report.count}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="hover:scale-105 transition-transform duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Per Service</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    ${report.count > 0 ? (totalRevenue / report.count).toFixed(2) : '0.00'}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Report Details */}
          <Card
            title={`Daily Report - ${new Date(selectedDate).toLocaleDateString()}`}
            subtitle={`${report.count} services processed`}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-gray-900">Service Details</h4>
                <Button onClick={handleDownloadReport} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>

              {report.data.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No services found for this date.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Plate Number
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Package
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.data.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.plateNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.packageName}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                            {item.packageDescription}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ${item.amountPaid.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(item.paymentDate).toLocaleTimeString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Reports;