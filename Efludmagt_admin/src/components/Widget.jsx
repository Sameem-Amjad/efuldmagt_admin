const Widget = ({ title, value, icon, bgColor }) => {
    return (
      <div className={`flex items-center p-4 bg-${bgColor}-500 text-white rounded-lg shadow`}>
        <div className="p-3 bg-white bg-opacity-20 rounded-full">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm">{title}</p>
          <p className="text-xl font-semibold">{value}</p>
        </div>
      </div>
    );
  };
  
  export default Widget;
  