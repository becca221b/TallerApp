import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "./card";
import { describe, it, expect } from "vitest";

describe("Card", () => {
    it("should render the card with the correct title and description", () => {
        render(
            <Card>
                <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card description goes here</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>This is the card content area.</p>
                </CardContent>
            </Card>
        );

        expect(screen.getByText("Card Title")).toBeInTheDocument();
        expect(screen.getByText("Card description goes here")).toBeInTheDocument();
    });

    it('renders card content', () => {
    render(
      <Card>
        <CardContent>
          <p>Card content here</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Card content here')).toBeInTheDocument();
  });

  it('renders card footer', () => {
    render(
      <Card>
        <CardFooter>
          <button>Action</button>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  it('renders complete card structure', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Order Card</CardTitle>
          <CardDescription>Order details</CardDescription>
        </CardHeader>
        <CardContent>Content area</CardContent>
        <CardFooter>Footer area</CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Order Card')).toBeInTheDocument();
    expect(screen.getByText('Order details')).toBeInTheDocument();
    expect(screen.getByText('Content area')).toBeInTheDocument();
    expect(screen.getByText('Footer area')).toBeInTheDocument();
  });
});

