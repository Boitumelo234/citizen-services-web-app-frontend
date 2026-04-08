import Input from "../common/Input";
import Button from "../common/Button";

function ComplaintForm({ onSubmit }) {
    return (
        <form onSubmit={onSubmit}>
            <Input label="Category" />
            <Input label="Description" />
            <Button text="Submit Complaint" type="submit" />
        </form>
    );
}

export default ComplaintForm;