function SideBarElement(props: {
  itemName: string;
  isSelected: boolean;
  onItemClick: (item: string) => void;
  icon: JSX.Element;
}) {
  return (
    <a
      href={`#${props.itemName.toLowerCase()}`}
      className={`py-3 px-4 my-1 ${
        props.isSelected
          ? "text-purple-500 bg-gray-100 rounded-md"
          : "text-gray-800"
      } hover:bg-gray-100 hover:text-purple-500 hover:rounded-md w-10/12 font-sans text-base font-semibold flex items-center`}
      onClick={() => props.onItemClick(props.itemName)}
    >
      <div className="mr-2">{props.icon}</div>
      {props.itemName}
    </a>
  );
}

export default SideBarElement;
