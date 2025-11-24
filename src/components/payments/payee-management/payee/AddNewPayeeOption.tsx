
interface AddNewPayeeOptionProps {
  onSelect: () => void;
}

const AddNewPayeeOption = ({ onSelect }: AddNewPayeeOptionProps) => {
  return (
    <div className="p-2 border-t">
      <div 
        className="flex items-center p-2 rounded-md cursor-pointer hover:bg-accent"
        onClick={onSelect}
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-medium">+</span>
          </div>
          <div className="font-medium">Add New Payee</div>
        </div>
      </div>
    </div>
  );
};

export default AddNewPayeeOption;
