import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Download, Share2, QrCode, Shield } from "lucide-react";

export default function WebId() {
  const studentData = {
    name: "Rahul Sharma",
    rollNo: "2021BCS042",
    branch: "Computer Science & Engineering",
    batch: "2021-2025",
    email: "2021bcs042@nitgoa.ac.in",
    bloodGroup: "O+",
    hostel: "Hostel Block A, Room 204",
    validUntil: "July 2025",
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
            <div className="card-base overflow-hidden">
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
                    <div className="h-32 w-28 bg-muted rounded-lg overflow-hidden border-2 border-border">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=180&fit=crop&crop=face"
                        alt="Student Photo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Name</p>
                      <p className="font-semibold text-foreground">{studentData.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Roll Number</p>
                      <p className="font-semibold text-foreground">{studentData.rollNo}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Branch</p>
                      <p className="text-sm text-foreground">{studentData.branch}</p>
                    </div>
                  </div>
                </div>

                {/* Additional Info Grid */}
                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-border">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Batch</p>
                    <p className="text-sm font-medium text-foreground">{studentData.batch}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Blood Group</p>
                    <p className="text-sm font-medium text-foreground">{studentData.bloodGroup}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Email</p>
                    <p className="text-sm font-medium text-foreground">{studentData.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Hostel</p>
                    <p className="text-sm font-medium text-foreground">{studentData.hostel}</p>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Valid Until</p>
                      <p className="text-sm font-medium text-foreground">{studentData.validUntil}</p>
                    </div>
                    <div className="h-20 w-20 bg-muted rounded-lg flex items-center justify-center border border-border">
                      <QrCode className="h-12 w-12 text-foreground" />
                    </div>
                  </div>
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
              <Button variant="outline" className="flex-1 gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" className="flex-1 gap-2">
                <Share2 className="h-4 w-4" />
                Share
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
