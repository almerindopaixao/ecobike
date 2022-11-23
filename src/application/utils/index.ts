export function calculateFaturamento(time: number): string {
    if (!time) throw new Error('time cannot be zero')

    const hour_value = 0.20;
    const hour_minutes = 60;

    const round_hour = Math.ceil(time / hour_minutes);
    return (round_hour * hour_value).toFixed(2);
}