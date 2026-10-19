// Dashboard.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '@/redux/features/dashboard/dashboardThunk';
import Card from './components/Card';
import Loader from '@/components/global/Loaders/Loader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { data: dashboardData, loading, error } = useSelector((state) => state.dashboard);

  // Fetch data when the component mounts
  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  const prepareCardData = () => {
    if (!dashboardData) return [];

    const { users, fuldmagtsCreated, fuldmagtsSigned } = dashboardData;

    return [
      { 
        id: 1, 
        icon: 'fas fa-user text-blue-500', 
        primaryValue: users.total, 
        secondaryValue: users.createdLastMonth, 
        label: 'New Users' 
      },
      { 
        id: 2, 
        icon: 'fas fa-envelope text-orange-500', 
        primaryValue: fuldmagtsCreated.total, 
        secondaryValue: fuldmagtsCreated.createdLastMonth, 
        label: 'e-fuldmagts Created' 
      },
      { 
        id: 3, 
        icon: 'fas fa-check-circle text-red-500', 
        primaryValue: fuldmagtsSigned.total, 
        secondaryValue: fuldmagtsSigned.createdLastMonth, 
        label: 'e-fuldmagts Signed' 
      },
    ];
  };

  // Prepare second set of card data based on fuldmagtForms
  const prepareFuldmagtFormsData = () => {
    if (!dashboardData) return [];

    const { fuldmagtForms } = dashboardData;

    return fuldmagtForms.map((form, index) => ({
      id: index + 4,
      icon: form.icon,
      primaryValue: form.fuldmagtsCreated,
      secondaryValue: form.fuldmagtsSigned,
      label: form.title,
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  const cardsData = prepareCardData();
  const cardsData2 = prepareFuldmagtFormsData();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* First Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition duration-300 ease-in-out cursor-pointer">
        {cardsData.map((card) => (
          <Card
            key={card.id}
            icon={card.icon}
            primaryValue={card.primaryValue}
            secondaryValue={card.secondaryValue}
            label={card.label}
          />
        ))}
      </div>

      {/* Second Grid of Cards (Fuldmagt Forms) */}
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardsData2.map((card) => (
            <Card
              key={card.id}
              icon={card.icon}
              primaryValue={card.primaryValue}
              secondaryValue={card.secondaryValue}
              label={card.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;