import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

export default function Home() {
  const { data } = useApp();
  
  // Get year from eventDate if available, otherwise use current year
  const getEventYear = () => {
    if (data.settings.eventDate) {
      return new Date(data.settings.eventDate).getFullYear();
    }
    if (data.settings.eventYear) {
      return data.settings.eventYear;
    }
    return new Date().getFullYear();
  };

  const eventYear = getEventYear();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <i className="fas fa-spa text-6xl text-primary" />
          </div>
          <h1 className="text-5xl font-bold mb-4">Sri Krishna Janmashtami</h1>
          <h2 className="text-3xl font-semibold text-muted-foreground mb-6">Competitions {eventYear}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Celebrate the divine birth of Lord Krishna through devotional competitions. 
            Join us in showcasing your talents and devotion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="rounded-[3rem] border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <i className="fas fa-user-plus text-primary" />
                Register Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                Register for multiple competitions and showcase your devotion to Lord Krishna. 
                Choose from various age-appropriate events.
              </p>
              <Link to="/register">
                <Button className="w-full rounded-[3rem]" size="lg">
                  Start Registration
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-[3rem] border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <i className="fas fa-trophy text-primary" />
                Hall of Fame
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">
                View the winners and celebrate their achievements. 
                See who has been honored in our divine competitions.
              </p>
              <Link to="/hall-of-fame">
                <Button variant="outline" className="w-full rounded-[3rem]" size="lg">
                  View Winners
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[3rem] border-2 bg-secondary/30">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Staff Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/admin/login">
                <Button variant="outline" className="rounded-[3rem]">
                  <i className="fas fa-user-shield mr-2" />
                  Admin Login
                </Button>
              </Link>
              <Link to="/judge/login">
                <Button variant="outline" className="rounded-[3rem]">
                  <i className="fas fa-gavel mr-2" />
                  Judge Login
                </Button>
              </Link>
              <Link to="/host/login">
                <Button variant="outline" className="rounded-[3rem]">
                  <i className="fas fa-microphone mr-2" />
                  Host Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12 text-sm text-muted-foreground">
          <p>{eventYear} Sri Krishna Janmashtami Competitions</p>
        </div>
      </div>
    </div>
  );
}
