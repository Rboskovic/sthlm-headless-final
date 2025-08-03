import {redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Link, useOutletContext, type MetaFunction} from 'react-router';
import {
  User,
  Clock,
  CreditCard,
  MapPin,
  Mail,
  ChevronRight,
} from 'lucide-react';
import type {CustomerFragment} from 'customer-accountapi.generated';

export const meta: MetaFunction = () => {
  return [{title: 'My Account'}];
};

export async function loader({context}: LoaderFunctionArgs) {
  // ✅ SHOPIFY HYDROGEN: Auth is handled by parent layout
  // This loader just ensures we're ready to render
  return {};
}

export default function AccountDashboard() {
  const {customer} = useOutletContext<{customer: CustomerFragment}>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details Card */}
          <AccountCard
            title="Account details"
            description="Change your name, log-in details, and contact information."
            icon={<User className="w-6 h-6 text-blue-600" />}
            href="/account/profile"
            details={[
              `Name: ${customer.firstName || ''} ${customer.lastName || ''}`,
              `Email: ${customer.emailAddress?.emailAddress || ''}`,
              `Phone: ${customer.phoneNumber?.phoneNumber || ''}`,
            ]}
          />

          {/* Order History Card */}
          <AccountCard
            title="Order history"
            description="You'll find your order history here after your first purchase with us. Happy shopping!"
            icon={<Clock className="w-6 h-6 text-blue-600" />}
            href="/account/orders"
          />

          {/* Payment Details Card */}
          <AccountCard
            title="Payment details"
            description="Add payment options for faster checkouts."
            icon={<CreditCard className="w-6 h-6 text-blue-600" />}
            href="/account/payment"
          />

          {/* My Addresses Card */}
          <AccountCard
            title="My addresses"
            description="Please add an address for faster future orders."
            icon={<MapPin className="w-6 h-6 text-blue-600" />}
            href="/account/addresses"
          />
        </div>

        {/* Marketing Section */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900">Marketing</h2>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-2">
                  Emails
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Receive special offers, promotions and new product information
                  by email. Please select your preference by ticking the
                  checkbox below.
                </p>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <span className="ml-3 text-sm text-gray-700">New Toys</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      defaultChecked
                    />
                    <span className="ml-3 text-sm text-gray-700">
                      Promotions
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/account/marketing"
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Manage preferences →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ REUSABLE COMPONENT: Following component consistency standards
interface AccountCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  details?: string[];
}

function AccountCard({
  title,
  description,
  icon,
  href,
  details,
}: AccountCardProps) {
  return (
    <Link to={href} className="block group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">{icon}</div>
            <div className="flex-grow">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                {title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>

              {details && (
                <div className="mt-3 space-y-1">
                  {details.map((detail, index) => (
                    <p key={index} className="text-sm text-gray-800">
                      {detail}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
        </div>
      </div>
    </Link>
  );
}
