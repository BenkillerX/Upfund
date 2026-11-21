const DepositMarquee = () => {
  const message =
    "When making a deposit, make sure your network is stable so your transaction can be processed without delays, And DO NOT REFRESH THE APPLICATION.";

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-300 bg-slate-50 py-3 shadow-sm">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[1, 2, 3, 4].map((item) => (
          <span
            key={item}
            className="mx-8 text-sm font-medium text-slate-900"
          >
            {message}
            <span className="mx-8 text-slate-600">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default DepositMarquee;