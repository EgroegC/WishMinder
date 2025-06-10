import { Card, CardContent, CardHeader } from '@/components/ui/card'

const Celebrations = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader><h3>Upcoming Birthdays</h3></CardHeader>
                <CardContent>
                    {/* List with birthdays */}
                </CardContent>
            </Card>
            <Card>
                <CardHeader><h3>Upcoming Namedays</h3></CardHeader>
                <CardContent>
                    {/* Namedays list */}
                </CardContent>
            </Card>
        </div>
    );
}

export default Celebrations