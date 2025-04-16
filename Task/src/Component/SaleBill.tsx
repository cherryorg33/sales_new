import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
// import { useReactToPrint } from "react-to-print";
import axios from "axios";
import { config } from "./config";
import {toast} from 'react-toastify';
// import { MdDeleteOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdAddModerator } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Product {
  name: string;
  mfr: string;
  batch: string;
  expiry: string;
  qty: number;
  mrp: number;
  gst: number;
  disc: number;
  total: number;
}

interface FormData {
  opSerial: string;
  op: string;
  location: string;
  store: string;
  consultant: string;
  patientName: string;
  mobile: string;
  age: number;
  gender: string;
  paymentMode: string;
  paymentType: string;
  note: string;
  discountPercent: number;
  additionalCharges: number;
  amountReceived: number;
  products: Product[];
}
// Add this interface for the invoice data
interface InvoiceData {
  invoiceNumber: string;
  date: string;
  patientName: string;
  consultant: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  discount: number;
  tax: number;
  grandTotal: number;
  paymentStatus: string;
}
const SaleBill = () => {
  const billRef = useRef<HTMLDivElement>(null);
  // const handlePrint = useReactToPrint({
  //   content: () => billRef.current,
  // });

  const [showInvoice, setShowInvoice] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  // const componentRef = useRef<HTMLDivElement>(null);
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   documentTitle: "Invoice",
  //   removeAfterPrint: true,
  // });

  const NavigateTo = useNavigate();

  const viewsales = async()=>{
    try{
      NavigateTo('/sale')

    }catch(error:any){
      console.log(error)
    }
  }


  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    // setValue,
  } = useForm<FormData>({
    defaultValues: {
      location: "Dr Aravinds IVF - PALAKKAD",
      store: "PHARMACY PALAKKAD",
      gender: "Male",
      paymentMode: "Single",
      paymentType: "Cash",
      discountPercent: 5,
      additionalCharges: 0,
      amountReceived: 0,
    },
  });

  const [products, setProducts] = useState<Product[]>([
    {
      name: "",
      mfr: "",
      batch: "",
      expiry: "",
      qty: 1,
      mrp: 0,
      gst: 0,
      disc: 0,
      total: 0,
    },
  ]);

  // Calculate totals whenever product data changes
  const calculateTotals = () => {
    const updatedProducts = products.map((product) => {
      const subtotal = product.qty * product.mrp;
      const discountAmount = subtotal * (product.disc / 100);
      const taxableAmount = subtotal - discountAmount;
      const gstAmount = taxableAmount * (product.gst / 100);
      const total = taxableAmount + gstAmount;
      return { ...product, total };
    });

    setProducts(updatedProducts);
    return updatedProducts;
  };

  // Calculate grand total
  const grandTotal = products.reduce((sum, product) => sum + product.total, 0);
  const discountAmount = grandTotal * (watch("discountPercent") / 100);
  const amountReceivable = grandTotal - discountAmount + (watch("additionalCharges") || 0);
  const dueAmount = amountReceivable - (watch("amountReceived") || 0);

  const addProductRow = () => {
    setProducts([
      ...products,
      {
        name: "",
        mfr: "",
        batch: "",
        expiry: "",
        qty: 1,
        mrp: 0,
        gst: 0,
        disc: 0,
        total: 0,
      },
    ]);
  };

  const deleteRow = (index: number) => {
    const updated = [...products];
    updated.splice(index, 1);
    setProducts(updated);
    calculateTotals();
  };




  const handleProductChange = (index: number, field: keyof Product, value: any) => {
    const updatedProducts = [...products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      [field]: field === 'name' || field === 'mfr' || field === 'batch' || field === 'expiry' 
        ? value 
        : Number(value)
    };
    // First update products, then recalculate
    const recalculated = updatedProducts.map((product) => {
      const subtotal = product.qty * product.mrp;
      const discountAmount = subtotal * (product.disc / 100);
      const taxableAmount = subtotal - discountAmount;
      const gstAmount = taxableAmount * (product.gst / 100);
      const total = taxableAmount + gstAmount;
      return { ...product, total };
    });
    setProducts(recalculated);
  };
  
  const onSubmit = async (data: FormData) => {
    try {
      // Prepare the complete data to send
      const submissionData = {
        ...data,
        products: calculateTotals(),
        total:grandTotal,
        discountAmount,
        amountReceivable,
        due:dueAmount,
      };

      console.log("Submitting data:", submissionData);
      
      // Uncomment when ready to connect to backend
      const response = await axios.post(`${config.BASE_URL}/sales`, submissionData);
      console.log("Response:", response.data);  
      toast.success(response.data.message);

      setInvoiceData({
        invoiceNumber: response.data.invoiceNumber,
        date: new Date().toLocaleDateString(),
        patientName: data.patientName,
        consultant: data.consultant,
        items: products.map(product => ({
          name: product.name,
          quantity: product.qty,
          price: product.mrp,
          total: product.total
        })),
        subtotal: grandTotal,
        discount: discountAmount,
        tax: products.reduce((sum, product) => sum + (product.total * product.gst / 100), 0),
        grandTotal: amountReceivable,
        paymentStatus: dueAmount <= 0 ? "Paid" : "Partial"
      });
      
      setShowInvoice(true);
     


      
    } catch (error:any) {
       console.log(error.response.data.message)
       toast.error(error.response.data.message.forEach((msg: string) => {
        toast.error(msg);
      }))
      
    }
  };

    // Add this component inside your SaleBill component
    const InvoiceModal = () => {
      if (!invoiceData) return null;
  
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-4xl">
            <div ref={invoiceRef} className="p-6">
            <div className="text-center mb-6">
          </div>
          <div className="text-center mb-8">
  {/* Title and Logo */}
  <h2 className="text-3xl font-bold text-blue-700 mb-2">MEDICAL INVOICE</h2>

  <div className="flex justify-center items-center mb-4">
    <img
      src="https://via.placeholder.com/100"
      alt="Hospital Logo"
      className="h-20 w-20 object-cover rounded-full border-2 border-blue-600"
    />
  </div>

  {/* Hospital Name and Details */}
  <h2 className="text-4xl font-extrabold text-blue-800 mb-2">
    Your Hospital Name
  </h2>
  <p className="text-xl font-semibold text-gray-700 mb-1">
    Clinic/Hospital Name
  </p>

  {/* Address and Contact */}
  <p className="text-sm text-gray-600 mb-2">
    123 Main St, Some Area, Some City, Some State - 123456
  </p>

  {/* Tagline */}
  <p className="text-sm italic text-gray-500 mb-2">
    Providing Excellent Healthcare Services for Over 20 Years
  </p>

  {/* Contact Info */}
  <div className="text-sm text-blue-600 mb-2">
    <span className="font-medium">Email:</span>{" "}
    <a href="mailto:support@hospital.com">support@hospital.com</a>
  </div>
  <p className="text-sm text-gray-600 mb-2">Address, City, State - PIN</p>

  {/* Socials (optional) */}
  <div className="flex justify-center space-x-4 text-blue-600 mt-2">
    <a href="https://facebook.com" className="hover:text-blue-800">
      <i className="fab fa-facebook-f"></i>
    </a>
    <a href="https://twitter.com" className="hover:text-blue-800">
      <i className="fab fa-twitter"></i>
    </a>
    <a href="https://instagram.com" className="hover:text-blue-800">
      <i className="fab fa-instagram"></i>
    </a>
  </div>
</div>

  
              <div className="flex justify-between mb-6">
                <div>
                  <p><strong>Invoice #:</strong> {invoiceData.invoiceNumber}</p>
                  <p><strong>Date:</strong> {invoiceData.date}</p>
                </div>
                <div className="text-right">
                  <p><strong>Patient:</strong> {invoiceData.patientName}</p>
                  <p><strong>Consultant:</strong> {invoiceData.consultant}</p>
                </div>
              </div>
  
              <table className="w-full border-collapse mb-6">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border text-left">Item</th>
                    <th className="p-2 border text-center">Qty</th>
                    <th className="p-2 border text-right">Price</th>
                    <th className="p-2 border text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, index) => (
                    <tr key={index}>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border text-center">{item.quantity}</td>
                      <td className="p-2 border text-right">₹{item.price.toFixed(2)}</td>
                      <td className="p-2 border text-right">₹{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
  
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-1">
                    <span>Subtotal:</span>
                    <span>₹{invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Discount:</span>
                    <span>₹{invoiceData.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Tax:</span>
                    <span>₹{invoiceData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold border-t">
                    <span>Due Total:</span>
                    <span>₹{invoiceData.grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Payment Status:</span>
                    <span className={invoiceData.paymentStatus === "Paid" ? "text-green-600" : "text-yellow-600"}>
                      {invoiceData.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
  
              <div className="mt-8 text-center text-sm">
                <p>Thank you for your business!</p>
                <p className="mt-2">For any queries, please contact: 9876543210</p>
              </div>
            </div>
  
            <div className="flex justify-center space-x-4 mt-4">
              
              <button
                onClick={() => setShowInvoice(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    };

  return (
    <>
     {/* Header Section */}
     <div className=" justify-between ml-6 mt-4 item-center justify-center">
        <button onClick={viewsales} className="bg-blue-600 text-white px-4 py-2 rounded flex space-x-6 border-black hover:bg-blue-700 cursor-pointer">
          View Sale
        </button>
        </div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        ref={billRef}
        className="p-6 bg-white shadow-lg rounded-2xl max-w-7xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">
          Sale Bill
        </h2>

       

  

        {/* OP & Store Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          
          <div>
            <label className="block text-sm font-medium mb-1">OP</label>
            <select
              {...register("op")}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select</option>
              <option value="OP">OP1</option>
              <option value="IP">OP2</option>
            </select>
          </div>
          {/* <div>
            <label className="block text-sm font-medium mb-1">OP Serial</label>
            <input
              {...register("opSerial")}
              type="text"
              className="w-full border rounded px-3 py-2"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Location<span className="text-red-500">*</span>
            </label>
            <select
              {...register("location", { required: true })}
              className="w-full border rounded px-3 py-2"
            >
              <option>Dr Aravinds IVF - PALAKKAD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Store</label>
            <select
              {...register("store", { required: true })}
              className="w-full border rounded px-3 py-2"
            >
              <option>PHARMACY PALAKKAD</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Consultant<span className="text-red-500">*</span>
            </label>
            <input
              {...register("consultant", { required: true })}
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Consultant Name"
            />
            {errors.consultant && (
              <span className="text-red-500 text-xs">This field is required</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Patient Name<span className="text-red-500">*</span>
            </label>
            <input
              {...register("patientName", { required: true })}
              type="text"
              className="w-full border rounded px-3 py-2"
            />
            {errors.patientName && (
              <span className="text-red-500 text-xs">This field is required</span>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile</label>
            <input
              {...register("mobile")}
              type="text"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              {...register("age", { valueAsNumber: true })}
              type="number"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              {...register("gender")}
              className="w-full border rounded px-3 py-2"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 border">S.No</th>
                <th className="p-2 border">Product Name</th>
                <th className="p-2 border">Mfr</th>
                <th className="p-2 border">Batch</th>
                <th className="p-2 border">Expiry</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">MRP</th>
                <th className="p-2 border">GST(%)</th>
                <th className="p-2 border">Disc(%)</th>
                <th className="p-2 border">Total</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="p-2 border text-center">{index + 1}</td>
                  <td className="p-2 border">
                    <input
                      value={product.name}
                      onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      value={product.mfr}
                      onChange={(e) => handleProductChange(index, 'mfr', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      value={product.batch}
                      onChange={(e) => handleProductChange(index, 'batch', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]} 
                      value={product.expiry}
                      onChange={(e) => handleProductChange(index, 'expiry', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="1"
                      value={product.qty}
                      onChange={(e) => handleProductChange(index, 'qty', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={product.mrp}
                      onChange={(e) => handleProductChange(index, 'mrp', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="0"
                      max="28"
                      value={product.gst}
                      onChange={(e) => handleProductChange(index, 'gst', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={product.disc}
                      onChange={(e) => handleProductChange(index, 'disc', e.target.value)}
                      className="w-full"
                    />
                  </td>
                  <td className="p-2 border text-right">
                    {product.total.toFixed(2)}
                  </td>
                  <td className="p-2 border text-center">
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => deleteRow(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <MdDelete   className=" text-black hover:text-red-800 text-2xl bg-red "/>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            type="button"
            onClick={addProductRow}
            className="mt-2 px-4 py-1 bg-slate-600 text-white rounded flex space-x-6 border-black hover:bg-blue-600"
          >
          <MdAddModerator className=" mr-2 text-xl" />  Add Product
          </button>
        </div>

        {/* Billing Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="font-medium block mb-1">Payment Mode:</label>
            <div className="space-x-4">
              <label>
                <input
                  type="radio"
                  {...register("paymentMode")}
                  value="Single"
                />{" "}
                Single
              </label>
              <label>
                <input
                  type="radio"
                  {...register("paymentMode")}
                  value="Multiple"
                />{" "}
                Multiple
              </label>
            </div>

            <div className="mt-4">
              <label className="font-medium block mb-1">
                Payment Type<span className="text-red-500">*</span>
              </label>
              <select
                {...register("paymentType", { required: true })}
                className="w-full border rounded px-3 py-2"
              >
                <option>Cash</option>
                <option>Card</option>
                <option>UPI</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="font-medium block mb-1">Additional Note:</label>
              <textarea
                {...register("note")}
                className="w-full border rounded px-3 py-2"
                rows={3}
              ></textarea>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between py-1">
              <span>Total:</span>
              <span>{grandTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Discount in %:</span>
              <span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register("discountPercent", { valueAsNumber: true })}
                  className="w-16 px-2 border rounded text-right"
                />%
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span>Discount Amount:</span>
              <span>{discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Additional Charges:</span>
              <span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  {...register("additionalCharges", { valueAsNumber: true })}
                  className="w-24 px-2 border rounded text-right"
                />
              </span>
            </div>
            <div className="flex justify-between py-1 font-semibold">
              <span>Amount Receivable:</span>
              <span>{amountReceivable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Amount Received:</span>
              <span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  {...register("amountReceived", { valueAsNumber: true })}
                  className="w-24 px-2 border rounded text-right"
                />
              </span>
            </div>
            <div className="flex justify-between py-1 font-semibold text-green-600">
              <span>Due:</span>
              <span>{dueAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 mr-4"
        >
          Submit
        </button>
        {/* <button
          type="button"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={handlePrint}
        >
          Print
        </button> */}
      </div>
    </form>
    {showInvoice && <InvoiceModal />}

    </>
  );
};

export default SaleBill;