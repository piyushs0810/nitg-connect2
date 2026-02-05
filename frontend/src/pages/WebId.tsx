import { useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Download, Shield, User } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { useAuth } from "@/context/AuthContext";

const InfoItem = ({ label, value }: { label: string; value?: string }) => (
  <div>
    <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
    <p className="text-sm font-medium text-foreground">{value || "Not provided"}</p>
  </div>
);

export default function WebId() {
  const { user } = useAuth();
  const cardRef = useRef<HTMLDivElement>(null);

  const studentData = {
    name: user?.name ?? "Student",
    rollNo: user?.rollNo ?? "N/A",
    branch: user?.branch ?? "Department",
    batch: user?.batch ?? "Not provided",
    email: user?.email ?? "student@nitg.ac.in",
    bloodGroup: user?.bloodGroup ?? "Not provided",
    hostel: user?.hostel ?? "Not provided",
    roomNumber: user?.roomNumber ?? "Not provided",
    contactNumber: user?.contactNumber ?? "Not provided",
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;

    const canvas = await html2canvas(cardRef.current, {
      scale: window.devicePixelRatio || 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 12;
    const printableWidth = pageWidth - margin * 2;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * printableWidth) / imgProps.width;

    pdf.setFontSize(14);
    pdf.text("NIT Goa - Digital Web ID", pageWidth / 2, margin, { align: "center" });
    pdf.addImage(imgData, "PNG", margin, margin + 4, printableWidth, pdfHeight, undefined, "FAST");
    pdf.save(`${studentData.rollNo || "web-id"}.pdf`);
  };

  return (
    <Layout>
      <div className="py-8 md:py-12">
        <div className="container-custom">
          {/* Header */}
          <div className="page-header text-center">
            <h1 className="page-title">Digital Web ID</h1>
            <p className="page-subtitle">Your official student identification card</p>
          </div>

          <div className="max-w-lg mx-auto">
            {/* ID Card */}
            <div ref={cardRef} className="card-base overflow-hidden">
              {/* Card Header */}
              <div className="bg-primary p-4 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">NIT Goa</h2>
                    <p className="text-sm opacity-90">National Institute of Technology Goa</p>
                  </div>
                  <div className="h-12 w-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-7 w-7" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="flex gap-6">
                  {/* Photo */}
                  <div className="flex-shrink-0">
                    <div className="h-32 w-28 bg-muted rounded-lg border-2 border-border flex items-center justify-center">
                      <User className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                      <p className="font-semibold text-foreground">{studentData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Branch</p>
                      <p className="text-sm text-foreground">{studentData.branch}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Batch</p>
                      <p className="text-sm text-foreground">{studentData.batch}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                  <InfoItem label="Blood Group" value={studentData.bloodGroup} />
                  <InfoItem label="Contact" value={studentData.contactNumber} />
                  <InfoItem label="Email" value={studentData.email} />
                  <InfoItem label="Hostel" value={studentData.hostel} />
                  <InfoItem label="Room Number" value={studentData.roomNumber} />
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-muted/50 px-6 py-4">
                <p className="text-xs text-center text-muted-foreground">
                  This is an official digital identification card issued by NIT Goa.
                  If found, please return to the institute.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button className="flex-1 gap-2" onClick={handleDownload}>
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-accent/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                <strong className="text-foreground">Note:</strong> This digital ID is for reference purposes.
                Always carry your physical ID card on campus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
