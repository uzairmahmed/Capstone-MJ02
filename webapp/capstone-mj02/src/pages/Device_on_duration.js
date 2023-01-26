import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
    {
      week: 'January 7-14',
      device_on_duration: 40,
      
    },
    {
      week: 'Febuary 14-28',
      device_on_duration: 50,
      
    },
    {
      week: 'March 1-8',
      device_on_duration: 70,
      
    },
    {
      week: 'April 7-14',
      device_on_duration: 45,
      
    },
  ];
  
function Deviceonduration (){
    return(
        <div>

            <div className="py-5">
                <h1 className="text-4xl text-center">Device On Duration</h1>
                <ResponsiveContainer className="py-5" width="100%" aspect={3}>
                  <BarChart width={730} height={250} data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="device_on_duration" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Deviceonduration;