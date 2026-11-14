const WithdrawMarquee = () => {
  const message =
    "Withdraw all funds from your wallet whenever you want. You can always deposit again later if you'd like to grow your money with us.";

  return (
    <div className="w-full overflow-hidden bg-slate-50 border border-slate-300 rounded-xl py-3">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className="mx-8 text-sm font-medium text-slate-800"
          >
            {message}
            <span className="mx-8 text-slate-500">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default WithdrawMarquee;
