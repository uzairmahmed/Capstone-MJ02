import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const data = [
    {
      week: 'January 7-14',
      money_spent: 40,
      
    },
    {
      week: 'Febuary 14-28',
      money_spent: 50,
      
    },
    {
      week: 'March 1-8',
      money_spent: 70,
      
    },
    {
      week: 'April 7-14',
      money_spent: 45,
      
    },
  ];
  
function Deviceonduration (){
    return(
        <div>

            <div className="py-5">
                <h1 className="text-4xl text-center">Device On Duration</h1>
                <ResponsiveContainer className="py-5" width="100%" aspect={3}>
                    <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="1 " horizontal="true" vertical = ""/>
                    <XAxis dataKey="week" label={{ value: 'Time (week)', position: 'insideBottom' }}/>
                    <YAxis label={{ value: 'Amount Spent ($)', angle: -90, position: 'insideLeft' }}/>
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="money_spent" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default Deviceonduration;