import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Card className="text-center">
        <CardContent>
          <h1 className="text-4xl font-bold tracking-tight">Inventory System</h1>
          <p className="mt-2 text-muted-foreground">
            Placeholder — features coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
