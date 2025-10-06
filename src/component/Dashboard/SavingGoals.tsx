type Goal = {
    name: string;
    progress: number; // نسبة مئوية
};

const SavingGoals = () => {
    const goals: Goal[] = [
        { name: "Buy a new laptop", progress: 70 },
        { name: "Vacation trip", progress: 45 },
        { name: "Emergency fund", progress: 90 },
    ];

    return (
        <div className="box p-6 rounded-xl h-full !w-full">
            <h2 className="text-lg font-semibold mb-4">Saving Goals</h2>

            <div className="space-y-4">
                {goals.map((goal, index) => (
                    <div key={index}>
                        {/* Goal name + percentage */}
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-700 font-medium">{goal.name}</span>
                            <span className="text-gray-500">{goal.progress}%</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-indigo-500 h-3 rounded-full"
                                style={{ width: `${goal.progress}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavingGoals;
