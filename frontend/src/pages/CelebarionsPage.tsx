import { Card, CardContent, CardHeader } from '@/components/ui/card'
import useContacts from '@/hooks/useContacts';
import BirthdayTable from '@/components/upcCelebrations/BirthdayTable';
import { Spinner } from '@/components/Spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import NamedayTable from '@/components/upcCelebrations/NamedaysTable';
import useUpcomingNamedays from '@/hooks/useUpcNamedays';


const Celebrations = () => {
    const { contacts, error, loading } = useContacts();
    const { upcNamedays, error: namError, loading: namLoading } = useUpcomingNamedays();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="pb-2">
                    <h3 className="text-xl font-semibold tracking-tight text-muted-foreground">
                        Upcoming Birthdays
                    </h3>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto px-0">
                    {loading ? (
                        <Spinner />
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Unable to fetch your contacts.</AlertTitle>
                            <AlertDescription>
                                <p>{error}</p>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <BirthdayTable contacts={contacts} />
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="pb-2">
                    <h3 className="text-xl font-semibold tracking-tight text-muted-foreground">
                        Upcoming Namedays
                    </h3>
                </CardHeader>
                <CardContent className="max-h-[500px] overflow-y-auto px-0">
                    {namLoading ? (
                        <Spinner />
                    ) : error ? (
                        <Alert variant="destructive">
                            <AlertCircleIcon />
                            <AlertTitle>Unable to fetch your contacts.</AlertTitle>
                            <AlertDescription>
                                <p>{namError}</p>
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <NamedayTable contacts={contacts} namedays={upcNamedays} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default Celebrations