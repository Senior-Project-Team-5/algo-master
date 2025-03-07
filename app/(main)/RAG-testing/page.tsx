import DocumentInput from "@/components/document-input";
import QueryForm from "@/components/query-form";

const RAGTestingPage = () => {
    return ( 
        <div>
            <h1 className="text-2xl font-bold mb-4">RAG Testing Page</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Document Input</h2>
                    <DocumentInput />
                </div>
                <div className="p-4 border rounded-lg">
                    <h2 className="text-xl font-semibold mb-2">Query Form</h2>
                    <QueryForm />
                </div>
            </div>
        </div>
     );
}
 
export default RAGTestingPage;